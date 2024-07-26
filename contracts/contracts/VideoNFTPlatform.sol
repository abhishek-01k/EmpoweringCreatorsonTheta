// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./utils/Counters.sol";

contract VideoNFTPlatform is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _collectionIds;

    VideoNFT public videoNFT;
    CreatorRegistry public creatorRegistry;

    struct Collection {
        address collectionAddress;
        uint256 counter;
    }

    mapping(uint256 => Collection) public collections;
    mapping(address => uint256[]) public creatorToCollections;

    event CollectionCreated(address indexed creator, uint256 collectionId, address collectionAddress);
    event NFTMinted(address indexed owner, uint256 collectionId, uint256 tokenId);

    constructor(address videoNFTAddress, address creatorRegistryAddress) Ownable(msg.sender) {
        videoNFT = VideoNFT(videoNFTAddress);
        creatorRegistry = CreatorRegistry(creatorRegistryAddress);
    }

    function createCollection() public {
        require(bytes(creatorRegistry.getCreator(msg.sender).name).length > 0, "Creator not registered");

        _collectionIds.increment();
        uint256 newCollectionId = _collectionIds.current();

        bytes32 salt = keccak256(abi.encodePacked(msg.sender, newCollectionId));
        address collectionAddress = Create2.deploy(
            0,
            salt,
            type(VideoNFTCollection).creationCode
        );

        collections[newCollectionId] = Collection({
            collectionAddress: collectionAddress,
            counter: 0
        });

        creatorToCollections[msg.sender].push(newCollectionId);

        emit CollectionCreated(msg.sender, newCollectionId, collectionAddress);
    }

    function mintNFTInCollection(uint256 collectionId, address to, string memory tokenURI) public onlyOwner {
        Collection storage collection = collections[collectionId];
        VideoNFTCollection videoNFTCollection = VideoNFTCollection(collection.collectionAddress);

        collection.counter++;
        uint256 newItemId = videoNFTCollection.mintNFT(to, tokenURI);

        emit NFTMinted(to, collectionId, newItemId);
    }

    function purchaseVideo(uint256 tokenId) public payable {
        VideoNFT.Video memory video = videoNFT.getVideo(tokenId);
        require(msg.value >= video.price * 70 / 100, "Insufficient payment");

        Collection storage collection = collections[tokenId];
        require(collection.collectionAddress != address(0), "Collection does not exist");

        VideoNFTCollection videoNFTCollection = VideoNFTCollection(collection.collectionAddress);
        videoNFTCollection.mintNFT(msg.sender, videoNFT.tokenURI(tokenId));

        uint256 platformFee = msg.value * 5 / 100;
        uint256 creatorPayment = msg.value - platformFee;

        payable(owner()).transfer(platformFee);
        payable(videoNFT.ownerOf(tokenId)).transfer(creatorPayment);
    }

    function getVideosByCreator(address creator) public view returns (uint256[] memory) {
        return creatorToCollections[creator];
    }
}