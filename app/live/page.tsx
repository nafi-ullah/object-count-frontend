"use client";

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://13.127.62.27:5000');

const VideoStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [tomatoCount, setTomatoCount] = useState<number>(0);

    // Send frame to backend for processing
    const sendFrameToBackend = () => {
        if (canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const frame = canvas.toDataURL('image/jpeg');
            socket.emit('video_frame', { frame: frame.replace('data:image/jpeg;base64,', '') });
        }
    };

    useEffect(() => {
        // Access webcam video on component mount
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }
                })
                .catch((err) => {
                    console.error("Error accessing webcam: ", err);
                });
        }

        // Listen for tomato count from backend
        socket.on('tomato_count', (data: { count: number }) => {
            setTomatoCount(data.count); // Update the count state with the received tomato count
        });

        // Continuously send frames to backend for processing
        const interval = setInterval(sendFrameToBackend, 40);

        return () => {
            clearInterval(interval); // Clean up the interval
            socket.off('tomato_count'); // Remove socket listener
        };
    }, []);

    // Function to restart the tomato count
    const restartCount = () => {
        socket.emit('restart_count'); // Send restart signal to backend
    };

    return (
        <div>
            <video
                ref={videoRef}
                width="1280"
                height="720"
                style={{ display: 'block' }}
            />
            <canvas
                ref={canvasRef}
                width="1280"
                height="720"
                style={{ display: 'none' }}
            />

            <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                Tomato Count: {tomatoCount}
            </div>

            {/* Restart Button */}
            <button
                onClick={restartCount}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}
            >
                Restart Count
            </button>
        </div>
    );
};

export default VideoStream;
