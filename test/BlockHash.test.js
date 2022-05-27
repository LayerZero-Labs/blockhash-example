const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Block Hash", function () {
  beforeEach(async function () {
    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];

    // use this chainId
    this.chainIdSrc = 1;
    this.chainIdDst = 2;

    // create a LayerZero Endpoint mock for testing
    const LZEndpointMock = await ethers.getContractFactory("LZEndpointMock");
    this.layerZeroEndpointMockSrc = await LZEndpointMock.deploy(
      this.chainIdSrc
    );
    this.layerZeroEndpointMockDst = await LZEndpointMock.deploy(
      this.chainIdDst
    );

    const BlockHashSend = await ethers.getContractFactory("BlockHashSend");
    const BlockHashReceive = await ethers.getContractFactory(
      "BlockHashReceive"
    );
    this.blockHashSend = await BlockHashSend.deploy(
      this.layerZeroEndpointMockSrc.address
    );
    this.blockHashReceive = await BlockHashReceive.deploy(
      this.layerZeroEndpointMockDst.address
    );

    this.layerZeroEndpointMockSrc.setDestLzEndpoint(
      this.blockHashSend.address,
      this.layerZeroEndpointMockSrc.address
    );
    this.layerZeroEndpointMockSrc.setDestLzEndpoint(
      this.blockHashReceive.address,
      this.layerZeroEndpointMockDst.address
    );
    this.layerZeroEndpointMockDst.setDestLzEndpoint(
      this.blockHashSend.address,
      this.layerZeroEndpointMockSrc.address
    );

    await this.blockHashSend.setTrustedRemote(
      this.chainIdSrc,
      this.blockHashSend.address
    ); // for A, set A
    await this.blockHashSend.setTrustedRemote(
      this.chainIdDst,
      this.blockHashReceive.address
    ); // for A, set B
    await this.blockHashReceive.setTrustedRemote(
      this.chainIdSrc,
      this.blockHashSend.address
    ); // for B, set A
  });

  it.only("send the block number on loopback to the source chain and then send blockhash to destination chain", async function () {
    let adapterParams = ethers.utils.solidityPack(
      ["uint16", "uint", "uint", "address"],
      [2, 250000, 2364896332154502, this.blockHashSend.address]
    );
    await this.blockHashSend.sendBlockNumber(
      this.chainIdDst,
      10000,
      adapterParams
    );
    expect(await this.blockHashReceive.getBlockHash()).to.be.equal(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });
});
