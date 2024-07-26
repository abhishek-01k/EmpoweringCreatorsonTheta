# Contracts for the video platform


### Changes made:
1. **VideoNFT**:
   - Added the `setVideoPrice` function to set the price directly within the `VideoNFT` contract.
   - Removed the unnecessary parameter in the constructor of `CreatorRegistry`.

2. **VideoNFTCollection**:
   - Fixed the multiple inheritance issue by overriding functions from both `ERC721URIStorage` and `ERC721Enumerable` correctly.
   - Adjusted the `supportsInterface` function to correctly override from `ERC721Enumerable` and `ERC721URIStorage`.

3. **VideoNFTPlatform**:
   - Updated to handle payment distribution correctly.


Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

### Explanation for the contracts of this project:

-   The smart contracts covers all the requirements for VideoNFTPlatform, including creator registration, video NFT minting, collection creation, payment handling, and DRM access for full videos.

1. **VideoNFT**:
   - Inherits `ERC721URIStorage` to allow storing video metadata.
   - Contains a struct `Video` to store video details.
   - Has a function `mintVideoNFT` for minting new video NFTs with relevant details.

2. **CreatorRegistry**:
   - Stores creator details such as name, image URL, and bio.
   - Allows creators to register themselves.

3. **VideoNFTPlatform**:
   - Manages the video NFT minting and collection creation.
   - Handles the payment process and DRM access for full videos.
   - Uses the `CREATE2` library to deploy new NFT collections with predictable addresses.
   - Allows the platform owner to mint and transfer NFTs from these collections to the users when they do 70% of the payment after viewing the preview video.

4. **VideoNFTCollection**:
   - An individual NFT collection contract that allows minting NFTs within the collection.
   - Inherits from `ERC721Enumerable` and `ERC721URIStorage` for enhanced functionality.