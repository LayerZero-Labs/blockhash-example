# LayerZero Blockhash Omnichain example

### Install

```shell
yarn install
```

### Deployment

prepare a new wallet that never send tx on any chain before, in order to keep all contracts with the same address on all chains.


## BlockHashSend.sol - an omnichain way to send a blockhash across chains
## BlockHashReceive.sol - an omnichain way to receive and store a blockhash

> WARNING: **You must perform the setTrustedRemote() (step 3).**

1. Fill out .env:
```angular2html
MNEMONIC="test test test test test test test test test test test test"
```
2. Deploy two contracts:
```angular2html
$ npx hardhat --network bsc-testnet deploy --tags BlockHashSend
$ npx hardhat --network fuji deploy --tags BlockHashReceive
```
3. Set the "trusted remotes" (ie: your contracts) so each of them can receive messages from one another, and `only` one another.
```angular2html
$ npx hardhat --network bsc-testnet setTrustedRemote --target-network bsc-testnet --src-contract-name BlockHashSend --dst-contract-name BlockHashSend 
$ npx hardhat --network bsc-testnet setTrustedRemote --target-network fuji --src-contract-name BlockHashSend --dst-contract-name BlockHashReceive 
$ npx hardhat --network fuji setTrustedRemote --target-network bsc-testnet --src-contract-name BlockHashReceive --dst-contract-name BlockHashSend 
```
4. Send a loop back from `bsc-testnet` to `bsc-testnet` containing the block number. Then on lzReceive in `bsc-testnet`, use the block number to get the blockhash and then send to `fuji`. When `fuji` gets the transaction it will store it into an array.
```angular2html
$ npx hardhat --network bsc-testnet sendBlockNumber --target-network fuji
```
5. On `fuji` check that the blockhash is stored in the contract.
```angular2html
$ npx hardhat --network fuji getBlockHash 
```
6. On `bsc-testnet` get the block using the blockhash
```angular2html
$ npx hardhat --network bsc-testnet getBlock --blockhash BLOCKHASH
```
