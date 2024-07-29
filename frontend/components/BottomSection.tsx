import React from "react";
import FlowChart from "@/public/FlowChart.png";
import Image from "next/image";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

const BottomSection = () => {
  return (
    <div className="my-12 px-12 flex flex-col gap-6">
      {/* <h1 className="font-bold tracking-tighter text-4xl md:text-5xl"> */}
      <h2 className="text-4xl font-semibold tracking-tight">
        How does the platform Work?
      </h2>
      {/* </h1> */}
      <Separator />
      <div className="max-w-[80vw] m-auto">
        <Image src={FlowChart} alt="FlowChart" />
      </div>
    </div>
  );
};

export default BottomSection;
