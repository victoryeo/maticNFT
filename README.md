# NFT with hardhat on Matic Mumbai testnet

This project demonstrates a basic NFT with Hardhat. 

hardhat
```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network mumbai
npx hardhat run scripts/deploy.js --network development
```

to mint NFT, run
```
node scripts/mintNft_ethers.js
```
