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
    address[] public creatorAddresses;

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

    function getAllCreators() public view returns (Creator[] memory) {
        Creator[] memory allCreators = new Creator[](cr);

        for (uint256 i = 0; i < creators.length; i++) {
            allCreators[i] = creators[i];
        }

        return allCreators;
    }

    function updateCreator(string memory name, string memory imageUrl, string memory bio) public {
        require(bytes(creators[msg.sender].name).length > 0, "Creator not registered");

        creators[msg.sender] = Creator({
            name: name,
            imageUrl: imageUrl,
            bio: bio
        });

        emit CreatorRegistered(msg.sender, name, imageUrl, bio);
    }

    function deleteCreator() public {
        require(bytes(creators[msg.sender].name).length > 0, "Creator not registered");

        delete creators[msg.sender];
    }

    function getCreatorCount() public view returns (uint256) {
        return creators.length;
    }

    function getnumberofvideos(address creator) public view returns (uint256) {
        return creators[creator].numberofvideos;
    }

}