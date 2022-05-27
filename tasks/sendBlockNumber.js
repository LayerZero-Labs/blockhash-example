const CHAIN_ID = require("../constants/chainIds.json");

module.exports = async function (taskArgs, hre) {
  const dstChainId = CHAIN_ID[taskArgs.targetNetwork];
  const blockHashSend = await ethers.getContract("BlockHashSend");

  let adapterParams = ethers.utils.solidityPack(
    ["uint16", "uint", "uint", "address"],
    [2, 250000, 2364896332154502, blockHashSend.address]
  );

  let tx = await (
    await blockHashSend.sendBlockNumber(dstChainId, 100000, adapterParams, {
      value: ethers.utils.parseEther("0.017"),
    })
  ).wait();
  console.log(`tx: ${tx.transactionHash}`);
};
