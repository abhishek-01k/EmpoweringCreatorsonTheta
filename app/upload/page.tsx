import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadPreview from '@/components/upload/UploadPreview';
import UploadVideo from '@/components/upload/UploadVideo';


const UploadPage = () => {
    return (
        <div className='flex justify-center'>

            <Tabs defaultValue="account" className="">
                <TabsList>
                    <TabsTrigger className='w-[250px]' value="account">Upload Preview</TabsTrigger>
                    <TabsTrigger className='w-[250px]' value="password">Upload Video</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <UploadPreview />
                </TabsContent>
                <TabsContent value="password">
                    <UploadVideo />
                </TabsContent>
            </Tabs>

        </div>
    );
};

export default UploadPage;