"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ListVideoPage = () => {
  const [videoslist, setVideosList] = useState<any[]>([]);
  const router = useRouter();

  const getAllVideoList = async () => {
    const res = await fetch(
      `https://api.thetavideoapi.com/video/${"srvacc_ipbhj6uhmy6f32spi8rkjjjff"}/list?page=1&number=100`,
      {
        headers: {
          "x-tva-sa-id": "srvacc_ipbhj6uhmy6f32spi8rkjjjff",
          // "x-tva-sa-id": process.env.THETA_VIDEO_API_KEY,
          // "x-tva-sa-secret": process.env.THETA_VIDEO_API_SECRET,
          "x-tva-sa-secret": "p5cwwh67pqn38ub5wenjm3b5jku7ch7c",
        },
      }
    );

    console.log("res >>", res);

    const response = await res.json();
    console.log("Response >>", response);

    const { videos } = response.body;

    setVideosList(videos);
  };

  function formatMilliseconds(ms: number) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    ms %= 1000 * 60 * 60;
    const minutes = Math.floor(ms / (1000 * 60));
    ms %= 1000 * 60;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;

    // Construct the formatted time string
    let timeString = "";
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
    if (seconds > 0 || minutes > 0 || hours > 0) timeString += `${seconds}s `;
    if (milliseconds > 0 || seconds === 0) timeString += `${milliseconds}ms`;

    return timeString.trim(); // Remove trailing whitespace
  }

  const formatDateTime = (isoString: any) => {
    const date = new Date(isoString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    getAllVideoList();
  }, []);

  return (
    <div>
      <Table>
        <TableCaption>List of Videos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Index</TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videoslist ? (
            videoslist?.map((video, index) => {
              return (
                <TableRow
                  className="cursor-pointer"
                  key={video.id}
                  onClick={() => router.push(`listvideos/${video.id}`)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{video.id}</TableCell>
                  <TableCell>{formatMilliseconds(video.duration)}</TableCell>
                  <TableCell className="text-right">
                    {formatDateTime(video.create_time)}
                  </TableCell>
                  <TableCell className="text-right">{video.state}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <div>No video item</div>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListVideoPage;
