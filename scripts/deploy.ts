import { ethers } from "hardhat";

async function main() {
  const BulkNFT = await ethers.getContractFactory("bulkNFT")
  // Start deployment, returning a promise that resolves to a contract object
  const bulkNFT = await BulkNFT.deploy()
  console.log("Contract deployed to address:", bulkNFT.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
