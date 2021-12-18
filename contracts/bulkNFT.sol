// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721]'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

contract bulkNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint constant NUM = 2;
    address[] _recipients;
    string private _BaseURI;

    constructor() ERC721("maticNFT", "NFT") {
      // hardcoded address for testing
      _recipients.push(0xE0f5206BBD039e7b0592d8918820024e2a7437b9);
      _recipients.push(0x9106BcAFb5cdcbbA5bD0d98fBbf2d82fD4245201);
      // call erc721 _mint
      // _mint emits an event each time
      //for (uint i = 0; i < NUM; i++) {
        //comment out if want to do mintManyNFT
        //super._mint(recipients[i], i);
      //}
    }

    function registerAddress(address added) public { 
      _recipients.push(added);  
    }

    // get the current supply of tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    // for opensea collection
    function tokenURI(uint256 tokenId_) public view override returns (string memory) {
      return bytes(_BaseURI).length > 0 ? string(abi.encodePacked("ipfs://", _BaseURI, "/", uint2str(tokenId_), ".json")) : "";
    }

    function mintNFT(address recipient_, string memory tokenURI_)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient_, newItemId);
        _setTokenURI(newItemId, tokenURI_);

        return newItemId;
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function append(string memory a, string memory b, string memory c, string memory d) 
      internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c, d));
    }

    function mintManyNFT(address[] memory recipients_, string memory baseURI_)
        public onlyOwner
        returns (uint256)
    {
        uint256 newItemId;
        string memory newTokenURI;
        string memory integerIndex;
        console.log("length %d", recipients_.length);
        for (uint i = 0; i < recipients_.length; i++) {
          console.log("recipient %s", recipients_[i]);

          _tokenIds.increment();
          newItemId = _tokenIds.current();
          _mint(recipients_[i], newItemId);

          integerIndex = uint2str(i);
          newTokenURI = append(baseURI_, '/',integerIndex, '.json');
          console.log(newTokenURI);
          _setTokenURI(newItemId, newTokenURI);
        }

        return recipients_.length;
    }

    // update tokenURI of individual NFT
    function updateNFT(uint256 tokenId_, string memory tokenURI_)
        public onlyOwner
    {
        _setTokenURI(tokenId_, tokenURI_);
    }

    // update hash of folder that contains multiple metadata files, eg. <i>.json
    function setBaseURI(string memory folderHash) public onlyOwner {
        _BaseURI = folderHash;
    }
}
