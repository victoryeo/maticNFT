import { task } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import * as dotenv from "dotenv";
import { getContract } from "../lib/contract";

dotenv.config();

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