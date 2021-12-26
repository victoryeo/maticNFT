import { ethers } from "ethers";

export function getProvider(): ethers.providers.JsonRpcProvider {
  const API_KEY = process.env.API_KEY
  const MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${API_KEY}`
  return new ethers.providers.JsonRpcProvider(MUMBAI);
}