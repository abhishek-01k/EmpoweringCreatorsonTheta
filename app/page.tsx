"use client";

import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ReactPlayer from 'react-player';

export default function Home() {

  const fileInputRef = useRef<HTMLInputElement>(null); // for the Drag and drop element

  // const [videoFile, setVideoFile] = React.useState<File | null>(null)
  // const [videoParts, setVideoParts] = React.useState();

  // const [videoSrc, setVideoSrc] = useState('');

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setVideoSrc(url);
  //   }
  // };

  // const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  // }

  // const handleDrop = (event: DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   const files = event.dataTransfer.files;
  //   if (files && files[0].type.slice(0, 5) == 'video') {
  //     setVideoFile(files[0])
  //   }
  // }
  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   console.log("Files >>>", files);
  //   if (files && files[0].type.slice(0, 5) == 'video') {
  //     console.log("Files [0]", files[0])
  //     setVideoFile(files[0])
  //     const file = files[0];

  //     // // Split the file into 15% and 85%
  //     // const chunkSize = Math.ceil(file.size * 0.15);
  //     // const firstChunk = file.slice(0, chunkSize);
  //     // const secondChunk = file.slice(chunkSize);

  //     const secondChunkURL = URL.createObjectURL(file);
  //     console.log("secondChunkURL", secondChunkURL);

  //     setVideoParts(secondChunkURL);
  //   }

  // }


  const [videoFile, setVideoFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [trimmedSrc, setTrimmedSrc] = useState('');
  const playerRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoSrc(url);
      setTrimmedSrc('');
    }
  };

  const handleTrim = () => {
    if (!videoFile) return;

    // Use the start and end times to set the source URL for the trimmed video
    const trimmedUrl = `${videoSrc}#t=${startTime},${endTime}`;
    setTrimmedSrc(trimmedUrl);
  };


  return (
    <main className="flex flex-1 flex-col gap-12">
      {/* <div className="flex flex-col justify-center gap-12 flex-1">
        <div>
          <p className="text-3xl"> Upload Your Video</p>
        </div>

        <div className="flex justify-center">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex justify-center border border-dashed rounded-lg px-10 py-10 min-w-[450px]"
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              ref={fileInputRef}
              id="picture"
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
            <Label htmlFor="picture">Drag your video here...</Label>
          </div>
        </div>

      </div>

      {videoSrc && (
        <div>
          <h2>Uploaded Video:</h2>
          <video width="600" controls>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )} */}

      <div>
        <h1>Upload, Trim, and View Video</h1>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        {videoSrc && (
          <div>
            <h2>Original Video:</h2>
            <ReactPlayer ref={playerRef} url={videoSrc} controls width="600px" />
            <div>
              <label>
                Start Time (seconds):
                <input
                  type="number"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
              <label>
                End Time (seconds):
                <input
                  type="number"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
              <button onClick={handleTrim}>Trim Video</button>
            </div>
          </div>
        )}
        {trimmedSrc && (
          <div>
            <h2>Trimmed Video:</h2>
            <ReactPlayer url={trimmedSrc} controls width="600px" />
          </div>
        )}
      </div>


    </main>
  );
}
