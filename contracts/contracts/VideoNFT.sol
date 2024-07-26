// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./utils/Counters.sol";

contract VideoNFT is ERC721URIStorage, Ownable {
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

    constructor() ERC721("VideoNFT", "VID") Ownable(msg.sender) {}

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

    function setVideoPrice(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only the creator can set the payment");
        videos[tokenId].price = price;
    }
}