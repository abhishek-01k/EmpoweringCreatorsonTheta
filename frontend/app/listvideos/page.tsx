"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { IoMdSearch } from "react-icons/io";
import { createThirdwebClient, getContract, prepareContractCall, readContract } from "thirdweb";
import { ThetaTestnet } from "@/constants/Chains/ThetaTestnet";
import { ContractType } from "@/config/contracts.config";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { toast } from "@/components/ui/use-toast";
import { AbiDecodingZeroDataError } from "viem";


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


const ListVideoPage = () => {
  const [videoslist, setVideosList] = useState<any[]>([]);
  const router = useRouter();

  const getAllVideoList = async () => {
    const res = await fetch(
      `https://api.thetavideoapi.com/video/${"srvacc_ipbhj6uhmy6f32spi8rkjjjff"}/list?page=1&number=100`,
      {
        headers: {
          "x-tva-sa-id": "srvacc_ipbhj6uhmy6f32spi8rkjjjff",
          "x-tva-sa-secret": "p5cwwh67pqn38ub5wenjm3b5jku7ch7c",
        },
      }
    );

    console.log("res >>", res);

    const response = await res.json();
    console.log("Response >>", response);

    const { videos } = response.body;

    setVideosList(videos);
  };

  function formatMilliseconds(ms: number) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    ms %= 1000 * 60 * 60;
    const minutes = Math.floor(ms / (1000 * 60));
    ms %= 1000 * 60;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;

    // Construct the formatted time string
    let timeString = "";
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
    if (seconds > 0 || minutes > 0 || hours > 0) timeString += `${seconds}s `;
    if (milliseconds > 0 || seconds === 0) timeString += `${milliseconds}ms`;

    return timeString.trim(); // Remove trailing whitespace
  }

  const formatDateTime = (isoString: any) => {
    const date = new Date(isoString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    getAllVideoList();
  }, []);

  const [searched, setSearched] = useState('');

  const activeAccount = useActiveAccount();

  const { data: searchedVideosList, isLoading, error } = useReadContract({
    contract: creatorContract,
    method: "getCreator",
    params: [searched as string],
  });

  console.log("isLoading", isLoading, searchedVideosList, error);

  const handleSearch = async () => {
    if (ethers.isAddress(searched)) {
      console.log("searched", searched);

      if (searchedVideosList) {
        setVideosList([searchedVideosList])
      }


    }
  }



  return (
    <div className="px-12 flex flex-col gap-8">

      <div className="flex flex-row justify-between">
        <h1 className="font-bold tracking-tighter text-4xl md:text-5xl">Videos List </h1>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="Search You Creator..."
            className="md:w-[300px] lg:w-[300px]"
            value={searched}
            onChange={(e) => setSearched(e.target.value)}
          />
          <Button onClick={handleSearch} type="submit">Search</Button>
        </div>

      </div>
      <Table>
        <TableCaption>List of Videos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Index</TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videoslist ? (
            videoslist?.map((video, index) => {
              return (
                <TableRow
                  className="cursor-pointer"
                  key={video.id}
                  onClick={() => router.push(`listvideos/${video.id}`)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{video.id}</TableCell>
                  <TableCell>{formatMilliseconds(video.duration)}</TableCell>
                  <TableCell className="text-right">
                    {formatDateTime(video.create_time)}
                  </TableCell>
                  <TableCell className="text-right">{video.state}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <div>No video item</div>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListVideoPage;
