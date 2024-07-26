// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VideoPlatform {
    
    struct Video {
        string title;
        string description;
        string previewVideoId;
        string fullVideoId;
    }

    struct Creator {
        string creatorName;
        uint[] videoIds;
    }

    mapping(uint => Video) public videos;
    mapping(address => Creator) public creators;
    mapping(string => address) public creatorAddressByName;

    uint public videoCounter;

    event VideoUploaded(uint videoId, string title, string description, string previewVideoId, string fullVideoId);
    event CreatorRegistered(address creatorAddress, string creatorName);

    modifier onlyExistingCreator(string memory creatorName) {
        require(creatorAddressByName[creatorName] != address(0), "Creator does not exist");
        _;
    }

    function registerCreator(string memory _creatorName) public {
        require(bytes(_creatorName).length > 0, "Creator name cannot be empty");
        require(creatorAddressByName[_creatorName] == address(0), "Creator name already taken");

        Creator storage creator = creators[msg.sender];
        creator.creatorName = _creatorName;
        creatorAddressByName[_creatorName] = msg.sender;

        emit CreatorRegistered(msg.sender, _creatorName);
    }

    function uploadVideo(string memory _title, string memory _description, string memory _previewVideoId, string memory _fullVideoId) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_previewVideoId).length > 0, "Preview video ID cannot be empty");
        require(bytes(_fullVideoId).length > 0, "Full video ID cannot be empty");

        videoCounter++;
        uint videoId = videoCounter;

        videos[videoId] = Video({
            title: _title,
            description: _description,
            previewVideoId: _previewVideoId,
            fullVideoId: _fullVideoId
        });

        creators[msg.sender].videoIds.push(videoId);

        emit VideoUploaded(videoId, _title, _description, _previewVideoId, _fullVideoId);
    }

    function getVideosByCreatorName(string memory _creatorName) public view onlyExistingCreator(_creatorName) returns (uint[] memory) {
        address creatorAddress = creatorAddressByName[_creatorName];
        return creators[creatorAddress].videoIds;
    }

    function fetchFullVideoIdByPreviewId(string memory _previewVideoId) public view returns (string memory) {
        for (uint i = 1; i <= videoCounter; i++) {
            if (keccak256(abi.encodePacked(videos[i].previewVideoId)) == keccak256(abi.encodePacked(_previewVideoId))) {
                return videos[i].fullVideoId;
            }
        }
        revert("Full video ID not found for the given preview ID");
    }
}
