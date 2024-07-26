1. Register Creator:
 A creator registers with their name, image URL, and bio.
 The VideoNFTPlatform stores the creator details.
 If valid, the creator is registered; otherwise, an error is thrown.

2. Mint Video NFT:
 The registered creator uploads video details including payment info (title, description, preview video URL, full video URL, token URI, payment amount).
 The VideoNFTPlatform stores the video metadata.
 A video NFT is minted with an assigned token ID and token URI.
 The NFT ID is stored in the creator's list.

3. Create Video NFT Collection:
 The platform owner creates a new video NFT collection using VideoNFTCollectionFactory.
 A new VideoNFTCollection contract is deployed with a predefined address using CREATE2.
 The new collection is mapped to the video NFT ID.

4. Access Preview Video:
 The user views the preview video, which is not access gated.

5. Payment Process:
 The user initiates payment for the full video.
 The user pays 70% of the listed amount.
 The platform owner mints and transfers an NFT from the collection to the user.
 The user gains access to the full video.
 The user can optionally pay the remaining 30% if they liked the video.

6. Payment Distribution:
 The platform fee (5%) is deducted from the payment.
 The remaining funds go to the token-bound account of the video NFT.
 The funds are then transferred to the creator.