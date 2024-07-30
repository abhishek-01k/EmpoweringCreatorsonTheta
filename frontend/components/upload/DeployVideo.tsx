import { ContractType } from "@/config/contracts.config";
import { ThetaTestnet } from "@/constants/Chains/ThetaTestnet";
import React, { useContext } from "react";
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  readContract,
} from "thirdweb";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
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
import VideoNFTPlatformABI from '@/config/VideoNFTPlatform.json'
import NFTPlatformABI from '@/config/VideoNFTPlatform.json'
import { CreatorContractABI } from "@/config/CreatorContract";

const client = createThirdwebClient({
  clientId: "f71177f93907409fbad88c670442fbb8",
});

const creatorContract = getContract({
  client,
  chain: ThetaTestnet,
  address: ContractType.CreatorContractAddress,
  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "imageUrl",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "bio",
          "type": "string"
        }
      ],
      "name": "CreatorRegistered",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "deleteCreator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "incrementVideoCount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "imageUrl",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "bio",
          "type": "string"
        }
      ],
      "name": "registerCreator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "imageUrl",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "bio",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "numberofvideos",
          "type": "uint256"
        }
      ],
      "name": "updateCreator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "creatorAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "creators",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "imageUrl",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "bio",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "numberofvideos",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllCreators",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "imageUrl",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "bio",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "numberofvideos",
              "type": "uint256"
            }
          ],
          "internalType": "struct CreatorRegistry.Creator[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "getCreator",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "imageUrl",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "bio",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "numberofvideos",
              "type": "uint256"
            }
          ],
          "internalType": "struct CreatorRegistry.Creator",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCreatorCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "getnumberofvideos",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
})

const NFTPlatformContract = getContract({
  client,
  chain: ThetaTestnet,
  address: ContractType.CreatorContractAddress,
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "videoNFTAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "creatorRegistryAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "Create2EmptyBytecode",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Create2FailedDeployment",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "Create2InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collectionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collectionAddress",
          "type": "address"
        }
      ],
      "name": "CollectionCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "deployCollection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collectionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "NFTMinted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "purchaseVideo",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "collections",
      "outputs": [
        {
          "internalType": "address",
          "name": "collectionAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "counter",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "collectionId",
          "type": "uint256"
        }
      ],
      "name": "computeCollectionAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "creatorRegistry",
      "outputs": [
        {
          "internalType": "contract CreatorRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "creatorToCollections",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "getVideosByCreator",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "videoNFT",
      "outputs": [
        {
          "internalType": "contract VideoNFT",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
})

const DeployVideo = () => {

  const activeAccount = useActiveAccount();

  const { data: userDetails, isLoading } = useReadContract({
    contract: creatorContract,
    method: "getCreator",
    params: [activeAccount?.address as string],
  });

  console.log("User Details >>", userDetails);

  const { data: getAllCreators, isLoading: loadingCreators } = useReadContract({
    contract: creatorContract,
    method: "getAllCreators",
    params: [],
  });

  console.log("Get ALl Creators >>", getAllCreators);

  const { data: nftPlatform, isLoading: loadingNFTPlatform, error } = useReadContract({
    contract: NFTPlatformContract,
    method: 'getVideosByCreator',
    params: [activeAccount?.address as string],
  });

  console.log("Get videos by Creator >>", nftPlatform, error);


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

  async function generateTokenURI() {
    try {
      if (!title || !description || !price) return;

      const input = {
        title,
        description,
        price,
        previewVideoId,
        videoId
      }

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
      return response.IpfsHash
      // if (response.IpfsHash) {
      //   setImageIPFS(response.IpfsHash);
      // }
    } catch (error) {
      console.log(error);
    }
  }


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
        </CardContent>
        <CardFooter>
          <Button
            // onClick={handleDeployVideo}
            className="flex items-center justify-center"
          >
            Deploy Video
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default DeployVideo;
