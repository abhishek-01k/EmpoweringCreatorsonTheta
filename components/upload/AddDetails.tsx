"use client"
import React, { useContext } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { UploadContext } from './UploadContext';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { uploadFormSchema } from '@/constants/UploadForm.forms';
import { Textarea } from "@/components/ui/textarea"


const AddDetails = () => {

    const { form } = useContext(UploadContext);

    function onSubmit(values: z.infer<typeof uploadFormSchema>) {
        console.log(values)
    }

    return (
        <>
            <Card className='max-w-[450px]'>
                <CardHeader>
                    <CardTitle>Add Details</CardTitle>
                    <CardDescription>
                        Add details of your video. Give a detail description of the video.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 mt-8">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" placeholder="Enter description" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            A short description of your video.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                step={1}
                                                type='number'
                                                inputMode='numeric'
                                                placeholder="Enter price"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>



        </>
    );
};

export default AddDetails;