const Web3 = require('web3')
require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

const ganachehost = 'http://localhost:9545'

// example web3 using testnet
//const web3 = new Web3(new Web3.providers.HttpProvider(ganachehost))

// example web3 using infura
const INFURA_PROJ_ID = process.env.INFURA_PROJ_ID

const provider = new HDWalletProvider(mnemonic,
  `https://rinkeby.infura.io/v3/${INFURA_PROJ_ID}`);
  
const web3 = new Web3(provider);

const nftContract = require("../artifacts/contracts/maticNFT.sol/maticNFT.json");

// nft contract address
const nftAddress = process.env.NFT_CONTRACT_ADDRESS;

let nftInst = new web3.eth.Contract(
  nftContract.abi, nftAddress
)

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function mintNFT(tokenURI) {
  let accounts = await web3.eth.getAccounts()
  //console.log(accounts[0])
  
  //get latest nonce
  const nonce = await web3.eth.getTransactionCount(accounts[0], "latest")
  //console.log(nonce)

  //const tokenId = await nftInst.methods.mintNFT(accounts[0], tokenURI)
  //console.log(tokenId)

  //the transaction
  const tx = {
    from: accounts[0],
    to: nftAddress,
    nonce: nonce,
    gas: 500000,
    data: nftInst.methods.mintNFT(accounts[0], tokenURI).encodeABI(),
  }

  try {
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
    }
  } catch(err) {
      console.log("Promise failed:", err)
  }
}

mintNFT(
  // metadata hashcode QmYueiuRNmL4....is from pinata
  "https://gateway.pinata.cloud/ipfs/QmbusPfav5k4R6hLg76PTTWH16r1ekAYKSg5vaSuKR9mQD"
)