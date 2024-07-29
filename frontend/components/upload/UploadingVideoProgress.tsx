import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { UploadContext } from "./UploadContext";

const UploadingVideoProgress = ({
  transcodingId,
}: {
  transcodingId: string;
}) => {
  const [progress, setProgress] = useState(0);
  const [playbackUri, setPlaybackUri] = useState(null);
  const intervalIdRef = useRef(null);

  const { setActiveState } = useContext(UploadContext);

  const fetchVideoProgress = async () => {
    const options = {
      method: "GET",
      url: "https://api.thetavideoapi.com/video/" + transcodingId,
      headers: {
        "x-tva-sa-id": "srvacc_ipbhj6uhmy6f32spi8rkjjjff",
        // "x-tva-sa-id": process.env.THETA_VIDEO_API_KEY,
        // "x-tva-sa-secret": process.env.THETA_VIDEO_API_SECRET,
        "x-tva-sa-secret": "p5cwwh67pqn38ub5wenjm3b5jku7ch7c",
      },
    };

    try {
      const response = await axios(options);
      const videoData = response.data.body.videos[0];
      if (videoData) {
        setProgress(videoData.progress);

        if (videoData.progress === 100 && videoData.playback_uri) {
          setPlaybackUri(videoData.playback_uri);
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching video progress:", error);
    }
  };

  console.log("playbackUri >>>>>", playbackUri);

  useEffect(() => {
    console.log("transcodingId", transcodingId);

    if (transcodingId) {
      // @ts-ignore
      intervalIdRef.current = setInterval(fetchVideoProgress, 3000);

      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
      };
    }
  }, [transcodingId]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg text-muted-foreground">
        Video Progress: {progress}%
      </p>

      {/* {progress == 100 && playbackUri && (
        <div>
          <div className="flex gap-4">
            <h3 className="text-lg text-muted-foreground">Video_Id : </h3>
            <p className="text-lg text-muted-foreground">{transcodingId}</p>
          </div>
          <div className="flex gap-4 items-center">
            <h3 className="text-lg text-muted-foreground">Playback_uri : </h3>
            <p className="text-lg text-muted-foreground">
              {playbackUri && playbackUri?.slice(0, 30)}
            </p>
            <Copy
              onClick={() => {
                navigator.clipboard.writeText(playbackUri);
              }}
              className="text-gray-600"
              size={18}
            />
          </div>
        </div>
      )} */}

      {progress === 100 && (
        <Button
          onClick={() => {
            setActiveState("upload_video");
          }}
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default UploadingVideoProgress;
