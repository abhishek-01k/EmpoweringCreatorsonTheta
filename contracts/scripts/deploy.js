// scripts/deploy.js

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", balance.toString());

    const VideoNFTPlatform = await ethers.getContractFactory("VideoNFTPlatform");
    const VideoNFTPlatformDeployed = await VideoNFTPlatform.deploy();
    console.log("Contract deployed to address:", VideoNFTPlatformDeployed.address);


    // const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
    // const CreatorRegistryDeployed = await CreatorRegistry.deploy();
    // console.log("Contract deployed to address:", CreatorRegistryDeployed.address);

    // const VideoNFT = await ethers.getContractFactory("VideoNFT");
    // const VideoNFTDeployed = await VideoNFT.deploy();
    // console.log("Contract deployed to address:", VideoNFTDeployed.address);

    // const VideoNFTCollection = await ethers.getContractFactory("VideoNFTCollection");
    // const VideoNFTCollectionDeployed = await VideoNFTCollection.deploy();
    // console.log("Contract deployed to address:", VideoNFTCollectionDeployed.address);

    console.log("Verifying contract on Etherscan...");
    await run("verify:verify", {
        address: VideoNFTPlatformDeployed.address,
    });

    console.log("Contract verified on Etherscan");


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
