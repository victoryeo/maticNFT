import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

// see https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
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
