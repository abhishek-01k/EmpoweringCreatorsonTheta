// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VideoNFTPlatform is ERC721URIStorage, Ownable {
    
    struct VideoMetadata {
        string title;
        string description;
        string previewVideoUrl;
        string fullVideoUrl;
    }

    struct Creator {
        string creatorName;
        uint[] nftIds;
    }

    mapping(uint => VideoMetadata) public videoMetadata;
    mapping(address => Creator) public creators;
    mapping(string => address) public creatorAddressByName;

    uint public nftCounter;

    event CreatorRegistered(address creatorAddress, string creatorName);
    event NFTMinted(uint tokenId, string title, string description, string previewVideoUrl, string fullVideoUrl);

    modifier onlyExistingCreator(string memory creatorName) {
        require(creatorAddressByName[creatorName] != address(0), "Creator does not exist");
        _;
    }

    constructor() ERC721("VideoNFTPlatform", "VNFT") {}

    function registerCreator(string memory _creatorName) public {
        require(bytes(_creatorName).length > 0, "Creator name cannot be empty");
        require(creatorAddressByName[_creatorName] == address(0), "Creator name already taken");

        Creator storage creator = creators[msg.sender];
        creator.creatorName = _creatorName;
        creatorAddressByName[_creatorName] = msg.sender;

        emit CreatorRegistered(msg.sender, _creatorName);
    }

    function mintNFT(
        string memory _title,
        string memory _description,
        string memory _previewVideoUrl,
        string memory _fullVideoUrl,
        string memory _tokenURI
    ) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_previewVideoUrl).length > 0, "Preview video URL cannot be empty");
        require(bytes(_fullVideoUrl).length > 0, "Full video URL cannot be empty");

        nftCounter++;
        uint tokenId = nftCounter;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        videoMetadata[tokenId] = VideoMetadata({
            title: _title,
            description: _description,
            previewVideoUrl: _previewVideoUrl,
            fullVideoUrl: _fullVideoUrl
        });

        creators[msg.sender].nftIds.push(tokenId);

        emit NFTMinted(tokenId, _title, _description, _previewVideoUrl, _fullVideoUrl);
    }

    function getNFTsByCreatorName(string memory _creatorName) public view onlyExistingCreator(_creatorName) returns (uint[] memory) {
        address creatorAddress = creatorAddressByName[_creatorName];
        return creators[creatorAddress].nftIds;
    }

    function fetchFullVideoUrlByPreviewUrl(string memory _previewVideoUrl) public view returns (string memory) {
        for (uint i = 1; i <= nftCounter; i++) {
            if (keccak256(abi.encodePacked(videoMetadata[i].previewVideoUrl)) == keccak256(abi.encodePacked(_previewVideoUrl))) {
                return videoMetadata[i].fullVideoUrl;
            }
        }
        revert("Full video URL not found for the given preview URL");
    }

    function fetchMetadataByTokenId(uint _tokenId) public view returns (VideoMetadata memory) {
        require(_exists(_tokenId), "Token ID does not exist");
        return videoMetadata[_tokenId];
    }
}
