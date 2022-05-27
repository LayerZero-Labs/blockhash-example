module.exports = async function (taskArgs) {
  let block = await ethers.provider.getBlock(taskArgs.blockhash);
  console.log(`block: ${JSON.stringify(block)}`);
};
