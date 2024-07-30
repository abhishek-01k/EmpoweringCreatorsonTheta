import React from "react";
import { Button } from "./ui/button";
import HomePage from "@/public/Homepage.webp";
import Image from "next/image";
import Link from "next/link";

const HomeScreen = () => {
  return (
    <div className="flex flex-row pt-12 justify-between px-12">
      <div className="flex flex-col gap-8  justify-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold tracking-tighter text-4xl md:text-5xl">
            Your Video Content{" "}
            <span className="bg-gradient-to-r from-[rgb(255,0,128)] to-[#7928CA] dark:from-[#7928CA] dark:to-[#FF0080] bg-clip-text text-transparent">
              Tokenized
            </span>
          </h1>
          <p className="text-balance max-w-2xl text-lg font-light text-foreground">
            Connecting Creators and Fans through NFTs
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <Link href='/listvideos'>
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" size="lg">
              Register as a Creator
            </Button>
          </Link>
        </div>
      </div>
      <Image src={HomePage} alt="HomePage" width={450} height={450} />
    </div>
  );
};

export default HomeScreen;
