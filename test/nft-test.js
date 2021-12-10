const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("test NFT", function () {
  it("Should mint new NFT", async function () {
    const [owner] = await ethers.getSigners();
    console.log(owner.address)

    const MaticNFT = await ethers.getContractFactory("maticNFT");
    const maticNFT = await MaticNFT.deploy();
    await maticNFT.deployed();

    const tokenURI="https://gateway.pinata.cloud/ipfs/QmNNaRsvHaYr72Ce1KXJDdNX4UCxw66yHe7ECyMwvRUiHE"

    const mintNFT = await maticNFT.mintNFT(owner.address, tokenURI);

    // wait until the transaction is mined
    await mintNFT.wait();
    //console.log(mintNFT);
    expect(await mintNFT.blockHash).to.be.a('string');
  });

  it("Should mint many NFT", async function () {
    const [owner] = await ethers.getSigners();
    console.log(owner.address)

    const MaticNFT = await ethers.getContractFactory("bulkNFT");
    const maticNFT = await MaticNFT.deploy();
    await maticNFT.deployed();

    const tokenURI="https://gateway.pinata.cloud/ipfs/QmSsA55c47dLc6K4Cn7uTSwjegsxaG45UEuNyhAEzvyBDh"

    const addresses = ["0xE0f5206BBD039e7b0592d8918820024e2a7437b9",
    "0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201"]
    const mintNFT = await maticNFT.mintManyNFT(addresses, tokenURI);

    // wait until the transaction is mined
    await mintNFT.wait();
    //console.log(mintNFT);
    expect(await mintNFT.blockHash).to.be.a('string');
  });
});
