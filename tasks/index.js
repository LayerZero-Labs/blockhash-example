task(
  "setTrustedRemote",
  "setTrustedRemote(chainId, sourceAddr) to enable inbound/outbound messages with your other contracts",
  require("./setTrustedRemote")
)
  .addParam("targetNetwork", "the target network to set as a trusted remote")
  .addOptionalParam("srcContractName", "the contract name on source")
  .addOptionalParam("dstContractName", "the contract name on destination");

task(
  "sendBlockNumber",
  "send a blockhash across chain",
  require("./sendBlockNumber")
).addParam("targetNetwork", "the target network to send the blockhash");

task(
  "getBlockHash",
  "get the last blockhash added to the array",
  require("./getBlockHash")
);

task(
  "getBlock",
  "get the block from the blockhash",
  require("./getBlock")
).addParam("blockhash", "the blockhash");
