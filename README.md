# NFT with hardhat on Matic Mumbai testnet

This project demonstrates a basic NFT with Hardhat. 

hardhat
```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat run scripts/deploy.js --network mumbai
npx hardhat run scripts/deploy.js --network development
```

To run the test, in one console, run
```
npx hardhat node --port 9545
```
and in another console, run
```
npx hardhat test
```
You can see the smart contract console log in the console running 'npx hardhat node'

to mint NFT, run
```
node scripts/mintNft_ethers.js
node scripts/mintNft_web3.js
```
