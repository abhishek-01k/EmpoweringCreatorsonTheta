// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VideoNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Video {
        string title;
        string description;
        string previewVideoUrl;
        string videoUrl;
        uint256 price;
    }

    mapping(uint256 => Video) public videos;

    constructor() ERC721("VideoNFT", "VID") {}

    function mintVideoNFT(
        address creator,
        string memory tokenURI,
        string memory title,
        string memory description,
        string memory previewVideoUrl,
        string memory videoUrl,
        uint256 price
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(creator, newItemId);
        _setTokenURI(newItemId, tokenURI);

        videos[newItemId] = Video({
            title: title,
            description: description,
            previewVideoUrl: previewVideoUrl,
            videoUrl: videoUrl,
            price: price
        });

        return newItemId;
    }

    function getVideo(uint256 tokenId) public view returns (Video memory) {
        return videos[tokenId];
    }
}

contract CreatorRegistry is Ownable {
    struct Creator {
        string name;
        string imageUrl;
        string bio;
    }

    mapping(address => Creator) public creators;

    event CreatorRegistered(address indexed creator, string name, string imageUrl, string bio);

    function registerCreator(string memory name, string memory imageUrl, string memory bio) public {
        require(bytes(creators[msg.sender].name).length == 0, "Creator already registered");

        creators[msg.sender] = Creator({
            name: name,
            imageUrl: imageUrl,
            bio: bio
        });

        emit CreatorRegistered(msg.sender, name, imageUrl, bio);
    }

    function getCreator(address creator) public view returns (Creator memory) {
        return creators[creator];
    }
}

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

    constructor(address videoNFTAddress, address creatorRegistryAddress) {
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

    function setCreatorPayment(uint256 tokenId, uint256 price) public {
        require(videoNFT.ownerOf(tokenId) == msg.sender, "Only the creator can set the payment");
        videoNFT.videos(tokenId).price = price;
    }

    function getVideosByCreator(address creator) public view returns (uint256[] memory) {
        return creatorToCollections[creator];
    }
}

contract VideoNFTCollection is ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("VideoNFTCollection", "VIDC") {}

    function mintNFT(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Enumerable, ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721URIStorage, ERC721) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
