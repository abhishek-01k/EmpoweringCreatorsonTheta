import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TranscodeVideo = ({ transcodingId }) => {
    const [progress, setProgress] = useState(0);
    const [playbackUri, setPlaybackUri] = useState(null);
    const intervalIdRef = useRef(null); // Use a ref to store the interval ID

    const fetchVideoProgress = async () => {
        const options = {
            method: 'GET',
            url: 'https://api.thetavideoapi.com/video/' + transcodingId,
            headers: {
                'x-tva-sa-id': 'srvacc_kswi9073t5mrtxtyk3k8sbqhx',
                'x-tva-sa-secret': 'sacqaj05zdm10b8rd1j2mnhndaj33g1b',
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
            console.error('Error fetching video progress:', error);
        }
    };

    useEffect(() => {
        console.log("transcodingId", transcodingId);

        if (transcodingId) {
            intervalIdRef.current = setInterval(fetchVideoProgress, 2000);

            // Clear the interval when the component unmounts or when transcodingId changes
            return () => {
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
                }
            };
        }
    }, [transcodingId]);


    console.log("playbackUri", playbackUri);


    return (
        <div>

            <h1>Video Progress: {progress}%</h1>

            {/* {transcodingId && (
                <>
                    <h1>Video Progress: {progress}%</h1>
                    <iframe
                        src={`https://player.thetavideoapi.com/video/${transcodingId}`}
                        border="0"
                        width="100%"
                        height="100%"
                        allowfullscreen
                    />
                </>
            )} */}



        </div>
    );
};

export default TranscodeVideo;
