import Web3 from 'web3';

import HDWalletProvider from '@truffle/hdwallet-provider'
import * as fs from 'fs';
import * as dotenv from "dotenv";

dotenv.config();

import parse from 'csv-parse';

const { mnemonic, api_key } = require('../.secret.json');

const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${api_key}`
const MATIC = `https://rpc-mainnet.maticvigil.com/v1/${api_key}`

console.log(process.env.NODE_ENV)
let provider: HDWalletProvider
if (process.env.NODE_ENV === 'prod') {
  provider = new HDWalletProvider(mnemonic, MATIC);
} else {
  provider = new HDWalletProvider(mnemonic, MUMBAI);
}

const web3 = new Web3(provider);

const nftContract = require("../artifacts/contracts/bulkNFT.sol/bulkNFT.json");

// nft contract address
const nftAddress = process.env.NFT_CONTRACT_ADDRESS;
console.log(nftAddress)

let csvData: string[] = [];
let addresses: string[] = [];

let nftInst = new web3.eth.Contract(
  nftContract.abi, nftAddress
)

function readCSV(filePath: string) {
  return new Promise ((resolve, reject) => {
    console.log(filePath)
    fs.createReadStream(filePath)
      .pipe(parse({delimiter: ':'}))
      .on('data', (csvrow:string) => {
          console.log(csvrow);
          //do something with csvrow
          csvData.push(csvrow);        
      })
      .on('end', () => {
        //do something with csvData
        resolve('parsing end')
      })
      .on('error', () => {
        reject('parsing error')
      })
  })
}

async function bulkMintNFT(tokenURI:string) {
  let accounts: string[] = await web3.eth.getAccounts()
  console.log(accounts[0])
  
  //get latest nonce
  const nonce: number = await web3.eth.getTransactionCount(accounts[0], "latest")
  console.log(nonce)

  // parsing the data
  csvData.filter((item, i) => {
    // match anything but double quotes , comma , or spaces
    // followed by spaces and comma
    const processRE: RegExpMatchArray | null = String(item).match(/([^",\s]+)(?=\s*,|\s*$)/g)
    if (processRE) 
      // third column contains the wallet address
      addresses[i] = processRE[2]
    
  })
  console.log(addresses)
  try {

    // bulk minting
    /*let addressesii = ["0xE0f5206BBD039e7b0592d8918820024e2a7437b9",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201"]*/
    var getData0 = await nftInst.methods.mintManyNFT(addresses, tokenURI)
                .send({from: accounts[0]})
    console.log(getData0)

    // estimate gas
    var getData1 = await nftInst.methods.mintManyNFT(addresses, tokenURI)
      .estimateGas({from: accounts[0]})
    console.log(getData1)

  } catch (err) {
    console.log(err)
  }

}

readCSV('./test.csv')
  .then(resp => {
    console.log(resp)  
    bulkMintNFT(
      // metadata hashcode QmYueiuRNmL4....is from pinata
      "https://gateway.pinata.cloud/ipfs/QmSsA55c47dLc6K4Cn7uTSwjegsxaG45UEuNyhAEzvyBDh"
    )
  })
  .catch(err => {
    console.warn(err)
  })
