"use client";
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const VideoStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [processedFrame, setProcessedFrame] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    // Handles the file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.play();
            }
        }
    };

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
        // Listen for processed frames from backend
        socket.on('processed_frame', (data: { frame: string }) => {
            setProcessedFrame(data.frame);
        });

        // Continuously send frames to backend for processing
        const interval = setInterval(sendFrameToBackend, 40);
        return () => clearInterval(interval); // Clean up
    }, []);

    return (
        <div>
            <input type="file" accept="video/*" onChange={handleFileChange} />

            <video ref={videoRef} width="1280" height="720" controls style={{ display: processedFrame ? 'none' : 'block' }} />
            <canvas ref={canvasRef} width="1280" height="720" style={{ display: 'none' }} />

            {processedFrame && (
                <img
                    src={`data:image/jpeg;base64,${processedFrame}`}
                    alt="Processed Video"
                    width="1280"
                    height="720"
                />
            )}
        </div>
    );
};

export default VideoStream;
