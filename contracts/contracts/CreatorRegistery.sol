// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CreatorRegistry is Ownable {

    struct Creator {
        string name;
        string imageUrl;
        string bio;
    }

    mapping(address => Creator) public creators;

    event CreatorRegistered(address indexed creator, string name, string imageUrl, string bio);

    constructor() Ownable(msg.sender) {}

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