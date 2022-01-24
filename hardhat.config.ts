import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";

import("./tasks/nft");

const { mnemonic, api_key } = require('./.secret.json');

const MUMBAI_API_URL=`https://rpc-mumbai.maticvigil.com/v1/${api_key}`;
const MATIC_API_URL=`https://rpc-mainnet.maticvigil.com/v1/${api_key}`;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
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
