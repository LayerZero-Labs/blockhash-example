// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "./lzApp/NonblockingLzApp.sol";

contract BlockHashReceive is NonblockingLzApp {

    bytes32[] public blockHashArray;

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    function _nonblockingLzReceive(
        uint16,
        bytes memory,
        uint64,
        bytes memory _payload
    ) internal override {
        bytes32 blockHash;
        (blockHash) = abi.decode(_payload, (bytes32));
        blockHashArray.push(blockHash);
    }

    function getBlockHash() public view returns (bytes32) {
        return blockHashArray[blockHashArray.length - 1];
    }
}
