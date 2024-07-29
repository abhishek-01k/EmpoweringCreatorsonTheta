
// Aimed : Creator registration and minting of video NFTs with a pre-determined address for the mapped NFT collection.
// Platform owner deploys the mapped NFT collection at the specified address.
// Users purchase the video NFTs and receive a minted NFT from the mapped collection.

// Smart Contract Modifications V3
// VideoNFT Contract: Add a mapping to store the address of the pre-determined NFT collection for each video NFT.

// VideoNFTPlatform Contract: Allow creators to specify the collection address during video NFT minting. The platform owner will deploy the collection later.

// CreatorRegitery - 0xD28181261FcC7892338C9a2eF8A8481CD4Db4570
// VideoNFT - 0x04b711705D01b9806A20E6dbd8C5Bab210045901
// VideoNFTPlatform - 0x1b943717b6479918F44c6032544CFF9Dd2C31a22

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract CreatorRegistry is Ownable {

    struct Creator {
        string name;
        string imageUrl;
        string bio;
        uint256 numberofvideos;
    }

    address[] public creatorAddresses;

    mapping(address => Creator) public creators;

    event CreatorRegistered(address indexed creator, string name, string imageUrl, string bio);

    constructor() Ownable(msg.sender) {}

    function registerCreator(string memory name, string memory imageUrl, string memory bio) public {
        require(bytes(creators[msg.sender].name).length == 0, "Creator already registered");
        creators[msg.sender] = Creator({ name: name, imageUrl: imageUrl, bio: bio , numberofvideos : 0 });
        creatorAddresses.push(msg.sender); // Add address to the array
        emit CreatorRegistered(msg.sender, name, imageUrl, bio);
    }

    function getCreator(address creator) public view returns (Creator memory) {
        return creators[creator];
    }

    function incrementVideoCount(address creator) public {
        require(bytes(creators[creator].name).length > 0, "Creator not registered");
        creators[creator].numberofvideos++;
    }

    function getAllCreators() public view returns (Creator[] memory) {
        Creator[] memory allCreators = new Creator[](creatorAddresses.length);
        for (uint256 i = 0; i < creatorAddresses.length; i++) {
            allCreators[i] = creators[creatorAddresses[i]];
        }
        return allCreators;
    }

    function updateCreator(string memory name, string memory imageUrl, string memory bio, uint256 numberofvideos) public {
        require(bytes(creators[msg.sender].name).length > 0, "Creator not registered");

        creators[msg.sender] = Creator({
            name: name,
            imageUrl: imageUrl,
            bio: bio,
            numberofvideos : numberofvideos
        });

        emit CreatorRegistered(msg.sender, name, imageUrl, bio);
    }

    function deleteCreator() public {
        require(bytes(creators[msg.sender].name).length > 0, "Creator not registered");

        delete creators[msg.sender];
    }

    function getCreatorCount() public view returns (uint256) {
        return creatorAddresses.length;
    }

    function getnumberofvideos(address creator) public view returns (uint256) {
        return creators[creator].numberofvideos;
    }
}



contract VideoNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Video {
        string title;
        string description;
        string previewVideoUrl;
        string videoUrl;
        uint256 price;
        address collectionAddress;
    }

    mapping(uint256 => Video) public videos;
    
    CreatorRegistry public creatorRegistry;

    constructor(address creatorRegistryAddress) ERC721("VideoNFT", "VID") Ownable(msg.sender) {
        creatorRegistry = CreatorRegistry(creatorRegistryAddress);
    }

    function mintVideoNFT(
        address creator,
        string memory tokenURI,
        string memory title,
        string memory description,
        string memory previewVideoUrl,
        string memory videoUrl,
        uint256 price,
        address collectionAddress
    ) public returns (uint256) {
        require(bytes(creatorRegistry.getCreator(creator).name).length > 0, "Creator not registered");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(creator, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        creatorRegistry.incrementVideoCount(creator);

        videos[newItemId] = Video({
            title: title,
            description: description,
            previewVideoUrl: previewVideoUrl,
            videoUrl: videoUrl,
            price: price,
            collectionAddress: collectionAddress
        });

        return newItemId;
    }

    function getVideo(uint256 tokenId) public view returns (Video memory) {
        return videos[tokenId];
    }

    function setVideoPrice(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only the creator can set the payment");
        videos[tokenId].price = price;
    }
}




contract VideoNFTCollection is ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

   // Collection Address
    constructor() ERC721("VideoNFTCollection", "VIDC") Ownable(0xdFB4fbbaf602C76E5B30d0E97F01654D71F23e54) {}

    function mintNFT(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }


    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Override the conflicting functions with correct virtual and override keywords
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
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

    constructor(address videoNFTAddress, address creatorRegistryAddress) Ownable(msg.sender) {
        videoNFT = VideoNFT(videoNFTAddress);
        creatorRegistry = CreatorRegistry(creatorRegistryAddress);
    }

    function deployCollection(uint256 tokenId) public onlyOwner {
        VideoNFT.Video memory video = videoNFT.getVideo(tokenId);
        require(video.collectionAddress == address(0), "Collection already deployed");

        _collectionIds.increment();
        uint256 newCollectionId = _collectionIds.current();

        bytes32 salt = keccak256(abi.encodePacked(videoNFT.ownerOf(tokenId), newCollectionId));

        address collectionAddress = Create2.deploy(
            0,
            salt,
            type(VideoNFTCollection).creationCode
        );

        collections[newCollectionId] = Collection({
            collectionAddress: collectionAddress,
            counter: 0
        });

        creatorToCollections[videoNFT.ownerOf(tokenId)].push(newCollectionId);
        video.collectionAddress = collectionAddress;

        emit CollectionCreated(videoNFT.ownerOf(tokenId), newCollectionId, collectionAddress);
    }

    function purchaseVideo(uint256 tokenId) public payable {
        VideoNFT.Video memory video = videoNFT.getVideo(tokenId);
        require(msg.value >= video.price * 70 / 100, "Insufficient payment");
        require(video.collectionAddress != address(0), "Collection not deployed");

        VideoNFTCollection videoNFTCollection = VideoNFTCollection(video.collectionAddress);
        videoNFTCollection.mintNFT(msg.sender, videoNFT.tokenURI(tokenId));

        uint256 platformFee = msg.value * 5 / 100;
        uint256 creatorPayment = msg.value - platformFee;

        payable(owner()).transfer(platformFee);
        payable(videoNFT.ownerOf(tokenId)).transfer(creatorPayment);

        emit NFTMinted(msg.sender, tokenId, videoNFTCollection.totalSupply());
    }

    function getVideosByCreator(address creator) public view returns (uint256[] memory) {
        return creatorToCollections[creator];
    }

    function computeCollectionAddress(address creator, uint256 collectionId) public view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(creator, collectionId));
        return Create2.computeAddress(salt, keccak256(type(VideoNFTCollection).creationCode));
    }
}
