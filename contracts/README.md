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



## Functions Flow 

Detailed flow with the specific contracts and functions that need to be called at each step:

### Flow for Creators

1. **Registering as a Creator**:
   - **Contract**: `CreatorRegistry`
   - **Function**: `registerCreator(name, imageUrl, bio)`

2. **Uploading a Video and Minting a Video NFT**:
   - **Contract**: `VideoNFT`
   - **Function**: `mintVideoNFT(creator, tokenURI, title, description, previewVideoUrl, videoUrl, price)`

3. **Creating a Collection for Video NFTs**:
   - **Contract**: `VideoNFTPlatform`
   - **Function**: `createCollection()`

### Flow for Platform Owner

1. **Minting and Transferring NFTs in a Collection**:
   - **Contract**: `VideoNFTPlatform`
   - **Function**: `mintNFTInCollection(collectionId, to, tokenURI)`

### Flow for Users

1. **Viewing a Preview**:
   - **Contract**: No contract interaction required (preview URL is accessed directly from the Video NFT metadata).

2. **Purchasing Access to the Full Video**:
   - **Contract**: `VideoNFTPlatform`
   - **Function**: `purchaseVideo(tokenId)`

3. **Optional Payment of Remaining 30%**:
   - **Contract**: Direct transfer to the creator's token-bound account (handled off-chain).

### Payment Flow

1. **Initiating Payment**:
   - **Contract**: `VideoNFTPlatform`
   - **Function**: `purchaseVideo(tokenId)`

2. **Distributing Payments**:
   - **Platform Fee**: Deducted within `purchaseVideo` function.
   - **Creator Payment**: Transferred within `purchaseVideo` function to the creator's token-bound account.

### Summary

- **Creators**:
  1. `CreatorRegistry.registerCreator(name, imageUrl, bio)`
  2. `VideoNFT.mintVideoNFT(creator, tokenURI, title, description, previewVideoUrl, videoUrl, price)`
  3. `VideoNFTPlatform.createCollection()`

- **Platform Owner**:
  1. `VideoNFTPlatform.mintNFTInCollection(collectionId, to, tokenURI)`

- **Users**:
  1. View preview (no contract function).
  2. `VideoNFTPlatform.purchaseVideo(tokenId)`
  3. Optional off-chain payment to the creator's token-bound account.