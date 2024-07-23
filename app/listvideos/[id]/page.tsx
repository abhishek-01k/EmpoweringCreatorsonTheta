"use client"
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

const VideoPage = ({ params }: { params: { id: string } }) => {

    const { id } = params;
    console.log("Id >>>", id);

    return (
        <div className='flex flex-col justify-center items-center gap-14'>

            <div className='flex flex-col gap-1 justify-center items-center'>
                <div className='text-4xl'> Video</div>
                <div className='text-gray-500'>{id}</div>
            </div>



            <div className='w-[400px] h-[400px]' >
                <iframe
                    src={`https://player.thetavideoapi.com/video/${id}`}
                    border="0"
                    width="500px"
                    height="300px"
                    allowfullscreen
                />
            </div>
        </div>
    );
};

export default VideoPage;