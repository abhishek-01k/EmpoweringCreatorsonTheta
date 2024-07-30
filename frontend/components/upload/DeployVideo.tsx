import { ContractType } from "@/config/contracts.config";
import { ThetaTestnet } from "@/constants/Chains/ThetaTestnet";
import React, { useContext } from "react";
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  readContract,
} from "thirdweb";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { UploadContext } from "./UploadContext";
import { ethers } from "ethers";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import VideoNFTPlatformABI from "@/config/VideoNFTPlatform.json";
import NFTPlatformABI from "@/config/VideoNFTPlatform.json";
import { CreatorContractABI } from "@/config/CreatorContract";

const client = createThirdwebClient({
  clientId: "f71177f93907409fbad88c670442fbb8",
});

const NFTPlatformContract = getContract({
  client,
  chain: ThetaTestnet,
  address: ContractType.VideoNFTPlatformAddress,
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "creator",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "collectionId",
          type: "uint256",
        },
      ],
      name: "computeCollectionAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "creator",
          type: "address",
        },
      ],
      name: "getVideosByCreator",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
});

const NFTContract = getContract({
  client,
  chain: ThetaTestnet,
  address: ContractType.VideoNFTAddress,
});

const DeployVideo = () => {
  const activeAccount = useActiveAccount();

  const { data: videosByCreator, isLoading } = useReadContract({
    contract: NFTPlatformContract,
    method: "getVideosByCreator",
    params: [activeAccount?.address as string],
  });
  console.log("videosByCreator", videosByCreator);

  const {
    form,
    previewVideoId,
    videoId,
    videoSrc,
    previewVideoSrc,
  } = useContext(UploadContext);

  const [title, description, price] = form.getValues([
    "title",
    "description",
    "price",
  ]);

  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZTE5MWQ0Ny1iOTUyLTRhNDEtODhlMS1jMGMwOWU5YThlNzkiLCJlbWFpbCI6ImFiaGlzaGVrc2luZ2gyMzU3NkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjI0ZTI3NWQyZWJiNDI5ZGM1MzYiLCJzY29wZWRLZXlTZWNyZXQiOiIwMDk0MzhmODYwOWFiZGJkMGM0ZTE2NGIxODE4NWM1OGM3YWIyNWQzZTc4NGUwZjE2MGExNzZiMTExYTg2ZGQ5IiwiZXhwIjoxNzUzNTQ1NzY1fQ.1ZU9_6OBRLsto0b3eTKHvbx44ble-hLp6Kpis8XfqD4";

  async function generateTokenURI({
    title,
    description,
    price,
    previewVideoId,
    videoId,
  }: {
    title: string,
    description: string,
    price: number,
    previewVideoId: string,
    videoId: string,
  }) {
    try {
      if (!title || !description || !price || !previewVideoId || videoId)
        return;

      const input = {
        title,
        description,
        price,
        previewVideoId,
        videoId,
      };

      console.log("JSONINPut", input);

      const request = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );
      const response = await request.json();
      console.log("Response >>>>>", response);
      return response.IpfsHash;
    } catch (error) {
      console.log(error);
    }
  }

  const getCollectionAddress = async () => {
    if (videosByCreator) {
      const collectionAddress = await readContract({
        contract: NFTPlatformContract,
        method: "computeCollectionAddress",
        params: [
          activeAccount?.address as string,
          BigInt(videosByCreator.length + 1),
        ],
      });

      console.log(
        "Compute Collection Address >>",
        collectionAddress,
        BigInt(videosByCreator.length + 1)
      );
      return collectionAddress
    } else {
      return ''
    }
  };

  const { mutate: deployVideo, isPending: deployingVideo } = useSendTransaction();

  const handleDeployVideo = async () => {
    const input = {
      title,
      description,
      price,
      previewVideoId,
      videoId,
    };

    const tokenURI = await generateTokenURI(input);
    const collectionAddress = await getCollectionAddress();

    const transaction = prepareContractCall({
      contract: NFTContract,
      method: "function mintVideoNFT(address creator,string memory tokenURI,string memory title,string memory description,string memory previewVideoUrl,string memory videoUrl,uint256 price,address collectionAddress) public returns (uint256)",
      params: [activeAccount?.address as string, tokenURI, title, description, previewVideoId, videoId, BigInt(price), collectionAddress],
    });

    deployVideo(transaction, {
      onSuccess: (value) => {
        console.log("Values >>>>", value);
        toast({
          title: 'Successfully Deployed Your video'
        })

      },
      onError: (error) => {
        console.log("Error >>>>", error);
        toast({
          variant: "destructive",
          title: 'Transaction unsuccessful',
          description: error.message
        })
      }
    })
  };

  return (
    <>
      <Card className="max-w-[450px]">
        <CardHeader>
          <CardTitle>Deploy Video</CardTitle>
          <CardDescription>
            Deploy Your video to our contracts and earn rewards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 mt-8">
          {previewVideoSrc && (
            <div className="flex flex-col gap-2">
              <p className="text-lg font-medium leading-none">Preview Video</p>
              <div className="w-[400px] m-auto">
                <video controls>
                  <source src={previewVideoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {videoSrc && (
            <div className="flex flex-col gap-2">
              <p className="text-lg font-medium leading-none">Video</p>
              <div className="w-[400px] m-auto">
                <video controls>
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-8">
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="text-lg font-medium leading-none">{title}</p>
            </div>
            <div className="grid gap-2 box-border">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-lg font-medium leading-none break-words">{description}</p>
            </div>
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-lg font-medium leading-none">{price}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={deployingVideo}
            onClick={handleDeployVideo}
            className="flex items-center justify-center"
          >
            {deployingVideo ? 'Deploying...' : 'Deploy Video'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default DeployVideo;
