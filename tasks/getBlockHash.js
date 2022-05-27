module.exports = async function () {
  const blockHashReceive = await ethers.getContract("BlockHashReceive");
  let blockHashes = await blockHashReceive.getBlockHash();
  console.log(`blockHash: ${JSON.stringify(blockHashes)}`);
};
