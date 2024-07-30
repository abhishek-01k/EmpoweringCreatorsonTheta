import React, { DragEvent, useContext, useRef, useState } from "react";
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
import { UploadContext } from "./UploadContext";
import { Label } from "../ui/label";
import axios from "axios";
import InlineError from "../InlineError";
import UploadingVideoProgress from "./UploadingVideoProgress";
import { createThirdwebClient, getContract } from "thirdweb";
import { ThetaTestnet } from "@/constants/Chains/ThetaTestnet";
import { ContractType } from "@/config/contracts.config";
import { useActiveAccount, useReadContract } from "thirdweb/react";
// import VideoNFTPlatformABI from "@/config/VideoNFTPlatform.json";

const client = createThirdwebClient({
  clientId: "f71177f93907409fbad88c670442fbb8",
});


const VideoNFTPlatformContract = getContract({
  client,
  chain: ThetaTestnet,
  address: ContractType.VideoNFTPlatformAddress,
  // abi: VideoNFTPlatformABI
  // abi: [{
  //   inputs: [
  //     {
  //       internalType: "address",
  //       name: "creator",
  //       type: "address"
  //     }
  //   ],
  //   name: "getVideosByCreator",
  //   outputs: [
  //     {
  //       internalType: "uint256[]",
  //       name: "",
  //       type: "uint256[]"
  //     }
  //   ],
  //   stateMutability: "view",
  //   type: "function"
  // },]
})

const UploadVideo = () => {
  const videoPreview = useRef<HTMLInputElement>(null); // for the Drag and drop element

  const activeAccount = useActiveAccount();

  const {
    form,
    previewVideoId,
    videoId,
    videoSrc,
    videoFile,
    setVideoSrc,
    setVideoId,
    setVideoFile,
  } = useContext(UploadContext);

  const [title, description, price] = form.getValues([
    "title",
    "description",
    "price",
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      console.log("UEL", url);
      setVideoSrc(url);
      setVideoFile(file);
    }
  };

  // const { data: collections, isLoading: loadingCollections } = useReadContract({
  //   contract: VideoNFTPlatformContract,
  //   method: "function computeCollectionAddress(address creator, uint256 collectionId) public view returns (address)",
  //   params: [activeAccount?.address as string, ''],
  // })

  // const { data: userDetails, isLoading } = useReadContract({
  //   contract: VideoNFTPlatformContract,
  //   method: "function computeCollectionAddress(address creator, uint256 collectionId) public view returns (address)",
  //   params: [activeAccount?.address as string, ''],
  // });

  // console.log("User Details >>", userDetails);

  const getSignedURL = async () => {
    try {
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
    if (!title || !description || !price || !videoFile) return;

    try {
      setIsUploading(true);
      setErrorMessage("");
      const uploads = await getSignedURL();
      const signedURL = uploads.presigned_url;

      if (!signedURL) {
        console.error("Failed to get signed URL.");
        setErrorMessage("Failed to get signed URL.");
        return;
      }

      await axios.put(signedURL, videoFile, {
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
      return { ...baseData, source_uri: videoFile };
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

    //TODO: Enter the NFT Collection address here
    // const drmRules = {
    //   chain_id: 361,
    //   nft_collection: "",
    //   title: "",
    //   link: "",
    //   image: "",
    //   description: "",
    // };

    // data.drm_rules = [drmRules];
    // data.use_drm = true;

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
      setVideoId(response.data.body.videos[0].id);
      setIsUploading(false);
    } catch (error) {
      setVideoId("");
      setIsUploading(false);
      const errorMessage = videoFile
        ? "Invalid video URL. Please fix and then try again."
        : "Error starting Video transcoding";
      setErrorMessage(errorMessage);
      console.error("Error fetching transcoding Video:", error);
    }
  };

  return (
    <Card className="max-w-[450px]">
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
        <CardDescription>Upload Your Complete video.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 mt-8">
        {videoId && <UploadingVideoProgress transcodingId={videoId} />}

        {errorMessage && (
          <InlineError title="Error" description={errorMessage} />
        )}

        {videoSrc && (
          <div className="w-[400px] m-auto">
            <video controls>
              <source src={videoSrc} type="video/mp4" />
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
            !!videoId ||
            !title ||
            !description ||
            !price ||
            !videoFile
          }
          onClick={handleUpload}
        >
          {isUploading ? "Uploading..." : videoId ? "Uploaded" : "Upload"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UploadVideo;
