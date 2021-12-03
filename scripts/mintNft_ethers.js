require("dotenv").config();
const { ethers } = require("ethers");

const contract = require("../artifacts/contracts/maticNFT.sol/maticNFT.json");
const contractInterface = contract.abi;

const API_KEY = process.env.API_KEY

const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`
const MATIC = `https://rpc-mainnet.maticvigil.com/v1/${API_KEY}`

const provider = new ethers.providers.JsonRpcProvider(MUMBAI);
console.log(provider)

// https://docs.ethers.io/v5/api/signer/#Wallet
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// get account address of the wallet
const signer = wallet.connect(provider);
console.log(signer.address)

// nft contract address
const nftAddress = process.env.NFT_CONTRACT_ADDRESS;

//https://docs.ethers.io/v5/api/contract/contract
const maticNFT = new ethers.Contract(
  nftAddress,
  contractInterface,
  wallet
);
//console.log(maticNFT)

const main = async () => {
  try {

    const gasPrice = await provider.getGasPrice()
    console.log(gasPrice.toString())

    // const transaction = await maticNFT.mintNFT(process.env.PUBLIC_KEY, "https://gateway.pinata.cloud/ipfs/QmTKyyNodQ2FkTsyxBr3UQLMw3Z4RkovfyWVaZostiuqX9")
    // console.log(transaction)

    const estimation = await maticNFT.estimateGas.mintNFT(process.env.PUBLIC_KEY, "https://gateway.pinata.cloud/ipfs/QmTKyyNodQ2FkTsyxBr3UQLMw3Z4RkovfyWVaZostiuqX9")
    console.log(estimation.toString())

    // update metadata uri
    //await maticNFT.updateNFT(1, "https://gateway.pinata.cloud/ipfs/QmZKHPQU9HW1QUSMHYJNEkNJGSUTYHnobw2ZxD7S3g1QJ1")

    const estimation2 = await maticNFT.estimateGas.updateNFT(1, "https://gateway.pinata.cloud/ipfs/QmZKHPQU9HW1QUSMHYJNEkNJGSUTYHnobw2ZxD7S3g1QJ1")
    console.log(estimation2.toString())
  } 
  catch(e) { 
    console.log("something went wrong", e)
  }
}

main();
