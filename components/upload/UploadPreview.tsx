"use client"
import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button";
import axios from "axios";
import UploadingVideoProgress from "./UploadingVideoProgress";
import InlineError from "../InlineError";
import { Textarea } from "@/components/ui/textarea"


const UploadPreview = () => {
    const [videoSrc, setVideoSrc] = useState('');
    const videoPreview = useRef<HTMLInputElement>(null); // for the Drag and drop element


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [previewVideoFile, setPreviewVideoFile] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [transcodingId, setTranscodingId] = useState('')


    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleFileChange(event);
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            console.log("UEL", url);
            setVideoSrc(url);
            setPreviewVideoFile(file)
        }
    };

    const getSignedURL = async () => {
        try {
            const response = await axios.post('https://api.thetavideoapi.com/upload', {}, {
                headers: {
                    'x-tva-sa-id': 'srvacc_kswi9073t5mrtxtyk3k8sbqhx',
                    'x-tva-sa-secret': 'sacqaj05zdm10b8rd1j2mnhndaj33g1b'
                }
            });
            return response.data.body.uploads[0];
        } catch (error) {
            console.error('Error fetching signed URL:', error);
        }
    }



    const handleUpload = async () => {
        if (!name || !description || !previewVideoFile) return;

        try {

            setIsUploading(true)
            const uploads = await getSignedURL()
            const signedURL = uploads.presigned_url;

            if (!signedURL) {
                console.error('Failed to get signed URL.');
                setErrorMessage('Failed to get signed URL.')
                return;
            }

            await axios.put(signedURL, previewVideoFile, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                }
            });
            transcodeVideo(uploads.id);


        } catch (error) {
            setIsUploading(false)
            console.error('Error uploading the file:', error);
        }

    }

    const createTranscodeData = (id: string | null): any => {
        const baseData = {
            playback_policy: "public",
            resolutions: [2160, 1080, 720, 360]
        };

        if (id) {
            console.log("Transcode via upload id");
            return { ...baseData, source_upload_id: id };
        } else {
            console.log("Transcode via external URL");
            return { ...baseData, source_uri: previewVideoFile };
        }
    };

    const getMetadata = () => {
        const metadata: any = {};

        if (name) metadata.name = name;
        if (description) metadata.description = description;

        return Object.keys(metadata).length ? metadata : null;
    };


    const transcodeVideo = async (id: string | null) => {
        let data = createTranscodeData(id);

        const metadata = getMetadata();
        if (metadata) data.metadata = metadata;

        console.log("Transcoding data with this metadata", data, metadata);

        try {

            const response = await axios.post('https://api.thetavideoapi.com/video', JSON.stringify(data), {
                headers: {
                    'x-tva-sa-id': 'srvacc_kswi9073t5mrtxtyk3k8sbqhx',
                    'x-tva-sa-secret': 'sacqaj05zdm10b8rd1j2mnhndaj33g1b',
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data.body);
            setTranscodingId(response.data.body.videos[0].id);
            setIsUploading(false);

        } catch (error) {
            setTranscodingId('');
            const errorMessage = previewVideoFile ? 'Invalid video URL. Please fix and then try again.' : 'Error starting Video transcoding';
            setErrorMessage(errorMessage);
            console.error('Error fetching transcoding Video:', error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Preview</CardTitle>
                <CardDescription>
                    Upload a short preview of your video.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-8">

                {transcodingId && <UploadingVideoProgress transcodingId={transcodingId} />}

                {errorMessage && <InlineError title='Error' description={errorMessage} />}


                {videoSrc && <div className="w-[400px] m-auto">
                    <video controls>
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>}
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex space-y-1 justify-center border border-dashed rounded-lg px-10 py-10"
                    onClick={() => videoPreview.current?.click()}
                >

                    <Label htmlFor="preview_video">Drag your video or Upload</Label>
                    <Input
                        ref={videoPreview}
                        id="preview_video"
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="Name">Name</Label>
                    <Input
                        id="Name"
                        placeholder="Enter Name of the preview"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="Description">Description</Label>
                    <Textarea
                        id="Description"
                        placeholder="Enter description of the preview"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="resize-none"
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button disabled={isUploading} onClick={handleUpload}>{isUploading ? 'Uplaoding...' : 'Upload'}</Button>
            </CardFooter>
        </Card>
    );
};

export default UploadPreview;