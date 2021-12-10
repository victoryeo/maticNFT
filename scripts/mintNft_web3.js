const Web3 = require('web3')
require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

const API_KEY = process.env.API_KEY

const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`
const MATIC = `https://rpc-mainnet.maticvigil.com/v1/${API_KEY}`

const provider = new HDWalletProvider(mnemonic, MUMBAI);
  
const web3 = new Web3(provider);

const nftContract = require("../artifacts/contracts/bulkNFT.sol/bulkNFT.json");

// nft contract address
const nftAddress = process.env.NFT_CONTRACT_ADDRESS;

let nftInst = new web3.eth.Contract(
  nftContract.abi, nftAddress
)

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function mintNFT(tokenURI) {
  let accounts = await web3.eth.getAccounts()
  console.log(accounts[0])
  
  //get latest nonce
  const nonce = await web3.eth.getTransactionCount(accounts[0], "latest")
  console.log(nonce)

  try {
    // method 1
    const token = await nftInst.methods
      .mintNFT(accounts[0], tokenURI)
      .send({from: accounts[0]})
    console.log(token.transactionHash)

    // method 2
    /*const tx = {
      from: accounts[0],
      to: nftAddress,
      nonce: nonce,
      gas: 500000,
      data: nftInst.methods.mintNFT(accounts[0], tokenURI).encodeABI(),
    }

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    const hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)      
    if (hash) {
      console.log(
        "The hash of your transaction is: ",
        hash.transactionHash,
        "\nCheck Mempool to view the status of your transaction!"
      )
      // hardcode the tokenId to one
      const tokenId = 1
      const uri = await nftInst.methods.tokenURI(tokenId).call()
      console.log(`token URI: ${uri}`)
    } */

  } catch (err) {
    console.log(err)
  }

}

async function bulkMintNFT(tokenURI) {
  let accounts = await web3.eth.getAccounts()
  console.log(accounts[0])
  
  //get latest nonce
  const nonce = await web3.eth.getTransactionCount(accounts[0], "latest")
  console.log(nonce)

  try {

    // bulk minting
    const addresses = ["0xE0f5206BBD039e7b0592d8918820024e2a7437b9",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201"]
    var getData = await nftInst.methods.mintManyNFT(addresses, tokenURI)
                .send({from: accounts[0]})
    console.log(getData)

    // estimate gas
    var getData = await nftInst.methods.mintManyNFT(addresses, tokenURI)
      .estimateGas({from: accounts[0]})
    console.log(getData)

  } catch (err) {
    console.log(err)
  }

}

bulkMintNFT(
  // metadata hashcode QmYueiuRNmL4....is from pinata
  "https://gateway.pinata.cloud/ipfs/QmSsA55c47dLc6K4Cn7uTSwjegsxaG45UEuNyhAEzvyBDh"
)

mintNFT(
  // metadata hashcode QmYueiuRNmL4....is from pinata
  "https://gateway.pinata.cloud/ipfs/QmZKHPQU9HW1QUSMHYJNEkNJGSUTYHnobw2ZxD7S3g1QJ1"
)