async function main() {
  const MaticNFT = await ethers.getContractFactory("maticNFT")
  // Start deployment, returning a promise that resolves to a contract object
  const maticNFT = await MaticNFT.deploy()
  console.log("Contract deployed to address:", maticNFT.address)

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
