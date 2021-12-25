async function main() {
  const SingleNFT = await ethers.getContractFactory("singleNFT")
  // Start deployment, returning a promise that resolves to a contract object
  const singleNFT = await SingleNFT.deploy()
  console.log("Contract deployed to address:", singleNFT.address)

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
