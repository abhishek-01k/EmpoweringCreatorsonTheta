import React from "react";
import { Button } from "./ui/button";

const UserBenefits = () => {
  return (
    <div className=" flex flex-col items-center justify-center dark:bg-gray-900 bg-gray-800 h-[450px] m-auto">
      <h2 className="text-4xl font-semibold tracking-tight text-white">
        What are User&apos;s benefits?
      </h2>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-white">
        <li>
          {" "}
          User&apos;s can collect exclusive NFTs for their top creators and be a
          part of history.
        </li>
        <li>
          They can pay directly to their favourite creator&apos;s without any
          intermediate person.
        </li>
        <li>
          They can watch preview of the video and decide whether to buy the
          related NFT or not for the video
        </li>
      </ul>
      <Button size="lg">Discover Now</Button>
    </div>
  );
};

export default UserBenefits;
