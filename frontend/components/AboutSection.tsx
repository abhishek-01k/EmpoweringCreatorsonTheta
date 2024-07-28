import React from "react";
import { Card, CardDescription, CardHeader } from "./ui/card";
import CreatorImage from "@/public/CreatorImage.jpg";
import Image from "next/image";
import { Separator } from "./ui/separator";
const AboutSection = () => {
  return (
    <div className="my-12 flex flex-col gap-6 px-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-semibold tracking-tight">
          About Platform
        </h2>
        <p className="text-xl text-muted-foreground">
          Create, Upload, Promote and Earn
        </p>
      </div>
      <Separator />
      <div className="flex gap-4">
        <Card>
          <CardHeader>
            <Image src={CreatorImage} alt="CreatorImage" />
          </CardHeader>
          <CardDescription className="px-8">
            <div className="flex flex-col">
              <h3 className="scroll-m-20 text-2xl font-bold text-foreground">
                Register as a Creator
              </h3>
              <p className="mt-6">
                Register Yourself as a creator and you can upload your video,
                add a preview video and earn rewards from the users directly
              </p>
            </div>
          </CardDescription>
        </Card>
        <Card>
          <CardHeader>
            <Image src={CreatorImage} alt="CreatorImage" />
          </CardHeader>
          <CardDescription className="px-8">
            <div className="flex flex-col">
              <h3 className="scroll-m-20 text-2xl font-bold text-foreground">
                Exclusive NFT Collection
              </h3>
              <p className="mt-6 mb-4">
                Create Your own NFT Collection which your users will buy and
                when they want to watch your video they will have to show that
                as a proof.
              </p>
            </div>
          </CardDescription>
        </Card>
        <Card>
          <CardHeader>
            <Image src={CreatorImage} alt="CreatorImage" />
          </CardHeader>
          <CardDescription className="px-8">
            <div className="flex flex-col">
              <h3 className="scroll-m-20 text-2xl font-bold text-foreground">
                Reach to a wider audience
              </h3>
              <p className="mt-6">
                You can reach to a wider audience using this platform. You just
                have to focus on content creation and leave rest of things to
                the blockchain network.
              </p>
            </div>
          </CardDescription>
        </Card>
      </div>
    </div>
  );
};

export default AboutSection;
