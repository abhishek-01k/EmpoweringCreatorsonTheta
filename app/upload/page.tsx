"use client"
import React, { useContext, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadPreview from '@/components/upload/UploadPreview';
import UploadVideo from '@/components/upload/UploadVideo';
import AddDetails from '@/components/upload/AddDetails';
import { z } from "zod"
import { UploadContext } from '@/components/upload/UploadContext';

const UploadPage = () => {

    return (
        <div className='flex justify-center'>

            <Tabs defaultValue="add_details" className="">
                <TabsList>
                    <TabsTrigger className='w-[150px]' value="add_details">Add Details</TabsTrigger>
                    <TabsTrigger className='w-[150px]' value="upload_preview">Upload Preview</TabsTrigger>
                    <TabsTrigger className='w-[150px]' value="upload_video">Upload Video</TabsTrigger>
                </TabsList>
                <TabsContent value="add_details">
                    <AddDetails />
                </TabsContent>
                <TabsContent value="upload_preview">
                    <UploadPreview />
                </TabsContent>
                <TabsContent value="upload_video">
                    <UploadVideo />
                </TabsContent>
            </Tabs>

        </div>
    );
};

export default UploadPage;