"use client";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VideoStream: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [tomatoCount, setTomatoCount] = useState<number>(0);
    const [currentSecond, setCurrentSecond] = useState<number>(0);
    const [ppm, setPPM] = useState<number>(0);
    const [ppmAverage, setPPMAverage] = useState<number>(0);
    const [fastestPPM, setFastestPPM] = useState<number>(0);

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

    // Send frame to backend for processing with video information
    const sendFrameToBackend = () => {
        if (canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const frame = canvas.toDataURL("image/jpeg");
            const currentTime = Math.floor(videoRef.current.currentTime); // Get current second of the video
            const isPaused = videoRef.current.paused;

            // Send the frame along with the current second and pause status
            socket.emit("video_info", {
                frame: frame.replace("data:image/jpeg;base64,", ""),
                frame_number: currentTime,
                paused: isPaused,
            });
        }
    };

    useEffect(() => {
        // Listen for processed metadata from the backend
        socket.on("processed_meta", (data: { total_output: number; ppm: number; ppm_average: number; fastest: number; current_frame_number: number }) => {
            setTomatoCount(data.total_output);
            setCurrentSecond(data.current_frame_number);
            setPPM(data.ppm);
            setPPMAverage(data.ppm_average);
            setFastestPPM(data.fastest);
        });

        // Continuously send frames to the backend for processing at intervals (40ms for ~25 FPS)
        const interval = setInterval(sendFrameToBackend, 40);
        return () => clearInterval(interval); // Clean up
    }, []);

    return (
        <div>
            <input type="file" accept="video/*" onChange={handleFileChange} />

            <div>
                <h3>Tomato Count: {tomatoCount}</h3>
                <h3>Processing Second: {currentSecond} sec</h3>
                <h3>PPM: {ppm}</h3>
                <h3>PPM Average: {ppmAverage}</h3>
                <h3>Fastest PPM: {fastestPPM}</h3>
            </div>

            <video ref={videoRef} width="1280" height="720" controls style={{ display: "block" }} />
            <canvas ref={canvasRef} width="1280" height="720" style={{ display: "none" }} />
        </div>
    );
};

export default VideoStream;
