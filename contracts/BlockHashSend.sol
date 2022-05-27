// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "hardhat/console.sol";
import "./lzApp/NonblockingLzApp.sol";

contract BlockHashSend is NonblockingLzApp {

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    function sendBlockNumber(
        uint16 _dstChainId,
        uint256 _gasForDestinationLzReceive,
        bytes calldata _adapterParams
    ) public payable {
        bytes memory trustedRemote = trustedRemoteLookup[
            lzEndpoint.getChainId()
        ];
        require(
            trustedRemote.length != 0,
            "LzApp: destination chain is not a trusted source"
        );
        bytes memory payload = abi.encode(
            block.number,
            _gasForDestinationLzReceive,
            address(msg.sender),
            _dstChainId
        );
        lzEndpoint.send{value: msg.value}(
            lzEndpoint.getChainId(),
            trustedRemote,
            payload,
            payable(msg.sender),
            address(0x0),
            _adapterParams
        );
    }

    function _nonblockingLzReceive(
        uint16,
        bytes memory,
        uint64,
        bytes memory _payload
    ) internal override {
        sendBlockHash(_payload);
    }

    function sendBlockHash(bytes memory _payload) public {
        uint256 blockNumber;
        uint256 gasForDestinationLzReceive;
        address originalSender;
        uint16 dstChainId;
        (
            blockNumber,
            gasForDestinationLzReceive,
            originalSender,
            dstChainId
        ) = abi.decode(_payload, (uint256, uint256, address, uint16));

        bytes memory trustedRemote = trustedRemoteLookup[dstChainId];
        require(
            trustedRemote.length != 0,
            "LzApp: destination chain is not a trusted source"
        );

        bytes memory payload = abi.encode(blockhash(blockNumber));

        uint16 version = 1;
        bytes memory adapterParams = abi.encodePacked(
            version,
            gasForDestinationLzReceive
        );

        (uint256 messageFee, ) = lzEndpoint.estimateFees(
            dstChainId,
            address(this),
            payload,
            false,
            adapterParams
        );

        require(
            address(this).balance >= messageFee,
            "address(this).balance < messageFee. fund this contract with more ether"
        );
        lzEndpoint.send{value: messageFee}(
            dstChainId,
            trustedRemote,
            payload,
            payable(originalSender),
            address(0x0),
            adapterParams
        );
    }

    // allow this contract to receive ether
    receive() external payable {}
}
