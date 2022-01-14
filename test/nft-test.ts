const { expect } = require("chai");
import { ethers, waffle } from 'hardhat';
import { Contract, Wallet } from "ethers";
import sinon from "sinon";
import * as provider from '../lib/provider';
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

function getTestWallet(): Wallet {
  return waffle.provider.getWallets()[0];
}

function deployTestContract(name: string): Promise<Contract> {
  return ethers.getContractFactory(name)
    .then((contractFactory) => contractFactory.deploy());
}

describe("test NFT", function () {
  it("Should mint new NFT", async function () {
    const [owner] = await ethers.getSigners();
    console.log(owner.address)

    const MaticNFT = await ethers.getContractFactory("singleNFT");
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
})

describe("mint NFT", function () {
  let deployedContract: Contract;
  let wallet: SignerWithAddress;
  const TOKEN_URI = "QmXFfXGGsCPbpsjrAfAN4Dn8czJ8kAUpwASej3CUmo6k9k";

  async function mintNftDefault(): Promise<TransactionResponse> {
    return deployedContract.mintNFT(wallet.address, TOKEN_URI);
  }

  beforeEach(async () => {
    //sinon.stub(provider, "getProvider").returns(waffle.provider);
    [wallet] = await ethers.getSigners();
    //const bulkNFT = await ethers.getContractFactory("bulkNFT");
    //deployedContract = await bulkNFT.deploy();
    //await deployedContract.deployed();
    deployedContract = await deployTestContract("bulkNFT");
  });

  describe("mintNft", async () => {
    it("emits the Transfer event", async () => {
      await expect(mintNftDefault())
        .to.emit(deployedContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, wallet.address, "1");
    });

    it("returns the new item ID", async () => {
      await expect(
        await deployedContract.callStatic.mintNFT(wallet.address, TOKEN_URI)
      ).to.eq("1");
    });

    it("increments the item ID", async () => {
      const STARTING_NEW_ITEM_ID = "1";
      const NEXT_NEW_ITEM_ID = "2";

      await expect(mintNftDefault())
        .to.emit(deployedContract, "Transfer")
        .withArgs(
          ethers.constants.AddressZero,
          wallet.address,
          STARTING_NEW_ITEM_ID
        );

      await expect(mintNftDefault())
        .to.emit(deployedContract, "Transfer")
        .withArgs(
          ethers.constants.AddressZero,
          wallet.address,
          NEXT_NEW_ITEM_ID
        );
    });

    it("cannot mint to address zero", async () => {
      const TX = deployedContract.mintNFT(
        ethers.constants.AddressZero,
        TOKEN_URI
      );
      await expect(TX).to.be.revertedWith("ERC721: mint to the zero address");
    });
  })

  describe("balanceOf", () => {
    it("gets the count of NFTs for this address", async () => {
      await expect(await deployedContract.balanceOf(wallet.address)).to.eq("0");
  
      await mintNftDefault();
  
      expect(await deployedContract.balanceOf(wallet.address)).to.eq("1");
    });
  });
});
