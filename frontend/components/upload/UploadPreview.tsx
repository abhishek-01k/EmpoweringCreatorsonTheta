"use client";
import React, { DragEvent, useContext, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import axios from "axios";
import UploadingVideoProgress from "./UploadingVideoProgress";
import InlineError from "../InlineError";
import { UploadContext } from "./UploadContext";

const UploadPreview = () => {
  const videoPreview = useRef<HTMLInputElement>(null); // for the Drag and drop element

  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const {
    form,
    previewVideoId,
    previewVideoSrc,
    previewVideoFile,
    setPreviewVideoId,
    setPreviewVideoSrc,
    setPreviewVideoFile,
    setActiveState,
  } = useContext(UploadContext);

  const [title, description, price] = form.getValues([
    "title",
    "description",
    "price",
  ]);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event);
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log("URL  >>>", url);
      setPreviewVideoSrc(url);
      setPreviewVideoFile(file);
    }
  };

  const getSignedURL = async () => {
    try {
      console.log(
        "process.env.THETA_VIDEO_API_KEY",
        process.env.THETA_VIDEO_API_KEY,
        process.env.THETA_VIDEO_API_SECRET
      );

      const response = await axios.post(
        "https://api.thetavideoapi.com/upload",
        {},
        {
          headers: {
            "x-tva-sa-id": "srvacc_ipbhj6uhmy6f32spi8rkjjjff",
            // "x-tva-sa-id": process.env.THETA_VIDEO_API_KEY,
            // "x-tva-sa-secret": process.env.THETA_VIDEO_API_SECRET,
            "x-tva-sa-secret": "p5cwwh67pqn38ub5wenjm3b5jku7ch7c",
          },
        }
      );
      return response.data.body.uploads[0];
    } catch (error) {
      console.error("Error fetching signed URL:", error);
    }
  };

  const handleUpload = async () => {
    console.log("Title", title, description, price, previewVideoFile);

    if (!title || !description || !price) {
      setActiveState("add_details");
      return;
    }

    if (!previewVideoFile) {
      return;
    }

    try {
      setIsUploading(true);
      const uploads = await getSignedURL();
      const signedURL = uploads.presigned_url;

      if (!signedURL) {
        console.error("Failed to get signed URL.");
        setErrorMessage("Failed to get signed URL.");
        return;
      }

      await axios.put(signedURL, previewVideoFile, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      transcodeVideo(uploads.id);
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading the file:", error);
    }
  };

  const createTranscodeData = (id: string | null): any => {
    const baseData = {
      playback_policy: "public",
      resolutions: [2160, 1080, 720, 360],
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

    if (title) metadata.name = title;
    if (description) metadata.description = description;
    if (price) metadata.price = price;

    return Object.keys(metadata).length ? metadata : null;
  };

  const transcodeVideo = async (id: string | null) => {
    let data = createTranscodeData(id);

    const metadata = getMetadata();
    if (metadata) data.metadata = metadata;

    console.log("Transcoding data with this metadata", data, metadata);

    try {
      const response = await axios.post(
        "https://api.thetavideoapi.com/video",
        JSON.stringify(data),
        {
          headers: {
            "x-tva-sa-id": "srvacc_ipbhj6uhmy6f32spi8rkjjjff",
            // "x-tva-sa-id": process.env.THETA_VIDEO_API_KEY,
            // "x-tva-sa-secret": process.env.THETA_VIDEO_API_SECRET,
            "x-tva-sa-secret": "p5cwwh67pqn38ub5wenjm3b5jku7ch7c",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.body);
      setPreviewVideoId(response.data.body.videos[0].id);
      setIsUploading(false);
    } catch (error) {
      setPreviewVideoId("");
      const errorMessage = previewVideoFile
        ? "Invalid video URL. Please fix and then try again."
        : "Error starting Video transcoding";
      setErrorMessage(errorMessage);
      console.error("Error fetching transcoding Video:", error);
    }
  };

  return (
    <Card className="max-w-[450px]">
      <CardHeader>
        <CardTitle>Upload Preview</CardTitle>
        <CardDescription>Upload a short preview of your video.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 mt-8">
        {previewVideoId && (
          <UploadingVideoProgress transcodingId={previewVideoId} />
        )}

        {errorMessage && (
          <InlineError title="Error" description={errorMessage} />
        )}

        {previewVideoSrc && (
          <div className="w-[400px] m-auto">
            <video controls>
              <source src={previewVideoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

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
      </CardContent>
      <CardFooter>
        <Button
          disabled={
            isUploading ||
            !title ||
            !description ||
            !price ||
            !previewVideoFile ||
            !!previewVideoId
          }
          onClick={handleUpload}
        >
          {isUploading
            ? "Uplaoding..."
            : previewVideoId
            ? "Uploaded"
            : "Upload"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UploadPreview;
