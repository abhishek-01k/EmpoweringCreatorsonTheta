"use client";
import React, { useContext, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadPreview from "@/components/upload/UploadPreview";
import UploadVideo from "@/components/upload/UploadVideo";
import AddDetails from "@/components/upload/AddDetails";
import { z } from "zod";
import { UploadContext } from "@/components/upload/UploadContext";
import { ActiveStateTypes } from "@/types/UploadForm.types";
import DeployVideo from "@/components/upload/DeployVideo";

const UploadPage = () => {
  const { activeState, setActiveState } = useContext(UploadContext);

  return (
    <div className="flex justify-center">
      <Tabs
        value={activeState}
        onValueChange={(value) => {
          setActiveState(value);
        }}
        defaultValue="add_details"
        className=""
      >
        <TabsList>
          <TabsTrigger className="w-[150px]" value="add_details">
            Add Details
          </TabsTrigger>
          <TabsTrigger className="w-[150px]" value="upload_video">
            Upload Video
          </TabsTrigger>
          <TabsTrigger className="w-[150px]" value="deply_video">
            Deploy Video
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add_details">
          <AddDetails />
        </TabsContent>

        <TabsContent value="upload_video">
          <UploadPreview />
          <UploadVideo />
        </TabsContent>

        <TabsContent value="deply_video">
          <DeployVideo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UploadPage;
