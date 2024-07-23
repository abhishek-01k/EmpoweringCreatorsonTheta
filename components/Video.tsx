"use client"
import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import TranscodeVideo from "./TranscodeVideo";

const Video = ({
    setPreviewVideoFile,
    previewVideoFile,
    transcodingId,
    setTranscodingId
}: {
    previewVideoFile: File | null
    setPreviewVideoFile: (file: File | null) => void
    transcodingId: any
    setTranscodingId: any
}) => {
    const [videoSrc, setVideoSrc] = useState('');
    const videoPreview = useRef<HTMLInputElement>(null); // for the Drag and drop element

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

    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // const [transcodingId, setTranscodingId] = React.useState('video_47nrtz71rfzvintu5kwhfbsw1c')

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
        if (previewVideoFile) {
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

    const transcodeVideo = async (id: string | null) => {
        let data = createTranscodeData(id);

        // const drmRules = getDrmRules();
        // data.use_drm = drmRules.length > 0;
        // if (data.use_drm) data.drm_rules = drmRules;

        // const metadata = getMetadata();
        // if (metadata) data.metadata = metadata;

        console.log(data);

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
    };

    return (
        <div className="flex flex-col">
            {videoSrc ? (
                <div>
                    <video width="600" controls>
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <Button onClick={handleUpload}> Upload Preview</Button>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex justify-center border border-dashed rounded-lg px-10 py-10 min-w-[450px]"
                    onClick={() => videoPreview.current?.click()}
                >
                    <Label htmlFor="preview_video">Preview Video</Label>
                    <Input
                        ref={videoPreview}
                        id="preview_video"
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                    <Label htmlFor="picture">Drag your video here...</Label>
                </div>
            )}

            <TranscodeVideo
                transcodingId={transcodingId}
            />


        </div>
    );
};

export default Video;