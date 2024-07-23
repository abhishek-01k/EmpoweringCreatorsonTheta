"use client";

import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Video from "@/components/Video";

export default function Home() {
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
  const [previewVideoId, setPreviewVideoId] = useState('video_i0g7cgzbr1jk4qa1z4ynzsmkwa');

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoId, setVideoId] = useState('');

  return (
    <main className="flex flex-1 flex-col gap-12">
      <div className="flex flex-col justify-center gap-12 flex-1">
        <div>
          <p className="text-3xl"> Upload Your Video</p>
        </div>

        <div className="flex justify-center">
          <div className="flex justify-center flex-col gap-8">
            <div>
              <div>Preview Video</div>
              {previewVideoId ? (
                <iframe
                  src={`https://player.thetavideoapi.com/video/${previewVideoId}`}
                  border="0"
                  width="100%"
                  height="100%"
                  allowfullscreen
                />
              ) : (
                <Video
                  previewVideoFile={previewVideoFile}
                  setPreviewVideoFile={setPreviewVideoFile}
                  transcodingId={previewVideoId}
                  setTranscodingId={setPreviewVideoId}
                />
              )}

            </div>

            <div>
              <div>Video</div>
              {videoId ? (
                <iframe
                  src={`https://player.thetavideoapi.com/video/${videoId}`}
                  border="0"
                  width="100%"
                  height="100%"
                  allowfullscreen
                />
              ) : (
                <Video
                  previewVideoFile={videoFile}
                  setPreviewVideoFile={setVideoFile}
                  transcodingId={videoId}
                  setTranscodingId={setVideoId}
                />
              )}

            </div>

            <div>
              <Label>Video Name</Label>
              <Input placeholder="Enter video name" />
            </div>
            <div>
              <Label>Video Description</Label>
              <Input placeholder="Enter video description" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
