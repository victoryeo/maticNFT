async function main() {
  const MaticNFT = await ethers.getContractFactory("maticNFT")

  // Start deployment, returning a promise that resolves to a contract object
  const maticNFT = await MaticNFT.deploy()
  console.log("Contract deployed to address:", maticNFT.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
