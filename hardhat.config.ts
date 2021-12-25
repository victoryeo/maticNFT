import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import * as dotenv from "dotenv";

dotenv.config();

import { getContract } from "./lib/contract";

// see https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploy NFT contract").setAction(async (_, hre) => {
  return hre.ethers
    .getContractFactory("bulkNFT")
    .then((contractFactory) => contractFactory.deploy())
    .then((result) => {
      console.log(`Contract address: ${result.address}`);
    });
});

//npx hardhat mint --network mumbai --token-uri "QmXFfXGGsCPbpsjrAfAN4Dn8czJ8kAUpwASej3CUmo6k9k"
task("mint", "Mint an NFT")
  .addParam("tokenUri", "Your ERC721 Token URI")
  .setAction(async (tokenUri, hre) => {
    return getContract("bulkNFT", hre)
      .then((contract: Contract) => {
        return contract.mintNFT(process.env.PUBLIC_KEY, tokenUri, {
          gasLimit: 500_000,
        });
      })
      .then((tr: TransactionResponse) => {
        console.log(`TX hash: ${tr.hash}`);
      });
  });


const { mnemonic, api_key } = require('./.secret.json');

const MUMBAI_API_URL=`https://rpc-mumbai.maticvigil.com/v1/${api_key}`;
const MATIC_API_URL=`https://rpc-mainnet.maticvigil.com/v1/${api_key}`;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: "0.8.0",
  defaultNetwork: "development",
  networks: {
    development: {
      url: "http://127.0.0.1:9545"
    },
    mumbai: {
      url: MUMBAI_API_URL,
      accounts: {mnemonic: mnemonic},
      gas: 2100000,
      gasPrice: 8000000000
    },
    matic: {
      url: MATIC_API_URL,
      accounts: {mnemonic: mnemonic},
      gas: 2100000,
      gasPrice: 8000000000
    },
    hardhat: {},
  },
};
