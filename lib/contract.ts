import { Contract, ethers } from "ethers";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { env } from './env';

export const getContract = (
  name: string, 
  hre: HardhatRuntimeEnvironment
): Promise<Contract> => {
  const API_KEY = process.env.API_KEY
  console.log(`API_KEY ${API_KEY}`)
  const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`
  const provider = new ethers.providers.JsonRpcProvider(MUMBAI);
  const WALLET = new ethers.Wallet(env("PRIVATE_KEY"), provider);
  return getContractAt(hre, name, env("NFT_CONTRACT_ADDRESS"), WALLET);
}

