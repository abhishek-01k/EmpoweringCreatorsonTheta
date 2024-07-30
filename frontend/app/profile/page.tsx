"use client";

import React from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { ThetaTestnet } from "@/constants/Chains/ThetaTestnet";
import { ContractType } from "@/config/contracts.config";
import Createprofile from "@/components/profile/Createprofile";
import Profile from "@/components/profile/Profile";
import { Card } from "@/components/ui/card";

const ProfilePage = () => {
  const activeAccount = useActiveAccount();

  const client = createThirdwebClient({
    clientId: "f71177f93907409fbad88c670442fbb8",
  });

  const contract = getContract({
    client,
    chain: ThetaTestnet,
    address: ContractType.CreatorContractAddress,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "creators",
        outputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "imageUrl",
            type: "string",
          },
          {
            internalType: "string",
            name: "bio",
            type: "string",
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
        name: "getCreator",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "imageUrl",
                type: "string",
              },
              {
                internalType: "string",
                name: "bio",
                type: "string",
              },
            ],
            internalType: "struct CreatorRegistry.Creator",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
  });

  const { data: userDetails, isLoading } = useReadContract({
    contract,
    method: "getCreator",
    params: [activeAccount?.address as string],
  });

  return (
    <Card className="w-[900px] m-auto h-[100%]">
      <div className="container relative  h-[100%] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative  h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Create Your Profile to upload videos so that your content
                is shared with a huge number of users on our platform. They can
                engage with your platform, contribute for your content.&rdquo;
              </p>
              <footer className="text-sm">Founder</footer>
            </blockquote>
          </div>
        </div>
        <>
          {isLoading ? (
            <div className="flex items-center  justify-center">Loading....</div>
          ) : (
            <>
              {userDetails?.name !== '' ? (
                <Profile userDetails={userDetails} />
              ) : (
                <Createprofile />
              )}
            </>
          )}
        </>
      </div>
    </Card>
  );
};

export default ProfilePage;
