"use client";
import Breadcrum from '@/components/Breadcrum';
import React, { useEffect, useState, useRef } from 'react';
import { TbReload } from "react-icons/tb";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { PiClockCountdown } from "react-icons/pi";
import { PiClockCountdownFill } from "react-icons/pi";
import { GiDamagedHouse } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import FileUpload from '@/components/VideoUpload';
import Spinner from '@/components/Designs/Spinner';
import ProgressExample from '@/components/Designs/DummyExample';
import ProgressBar from '@/components/Designs/ProgressBar';
import io from 'socket.io-client';

const socket = io('http://13.127.62.27:5000');

interface StatCardProps {
    title: string;
    data: string | number;
    icon: React.ReactNode;
    buttonCall: () => void;
  }

const StatCard: React.FC<StatCardProps> = ({ title, data, icon, buttonCall }) => {
    return (
      <div className='bg-white rounded-lg p-8 py-6 h-full flex flex-col justify-between'>
        <div className='flex justify-between'>
          <div>
            <div className='text-lg text-gray-600'>{title}</div>
            <div className='my-3 text-3xl'>{data}</div>
          </div>
          <div className='rounded-lg flex justify-center items-center w-14 h-14 bg-[#F4F7FF]'>{icon}</div>
        </div>
        <div className='mt-2'>
          <button onClick={buttonCall} className="font-semibold text-blue-700">
            <span className='flex items-center space-x-2'> <div>View Details</div> <div><FaArrowRight/></div></span>
          </button>
        </div>
      </div>
    );
  };

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
        <div className='w-screen h-screen px-14 py-1 overflow-x-hidden'>
        <div className='w-full'>
          <Breadcrum resetCount={restartCount}/>
        </div>
        <div className='w-full md:flex flex-cols md:space-x-10 space-x-0 space-y-10 md:space-y-0 overflow-x-hidden'>
        <div className='w-1/5 h-[80vh]   pt-10 '>
          <div className='grid grid-cols-1 gap-5 items-stretch h-full'>
       
          <StatCard 
              title='Product Name' 
              data="Tomatoes" 
              icon={<PiClockCountdown className='text-blue-500 w-6 h-6'/>} 
              buttonCall={() => { console.log('Button clicked!'); }}  
            />
        <StatCard 
              title='Total Count' 
              data={tomatoCount} 
              icon={<TbRosetteDiscountCheck className='text-blue-500 w-6 h-6'/>} 
              buttonCall={() => { console.log('Button clicked!'); }}  
            />
            
                 <StatCard 
              title='Healthy Tomato Count' 
              data={`${Math.floor(tomatoCount * 0.95)}`} 
              icon={<PiClockCountdown className='text-blue-500 w-6 h-6'/>} 
              buttonCall={() => { console.log('Button clicked!'); }}  
            />
                      <StatCard 
              title='Unripened Tomato Count' 
              data={`${Math.floor(tomatoCount * 0.05)}`} 
              icon={<PiClockCountdown className='text-blue-500 w-6 h-6'/>} 
              buttonCall={() => { console.log('Button clicked!'); }}  
            />
             </div> 
             </div>   
             <div className='w-4/5 h-[80vh]   pt-10 overflow-y-hidden'>
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
            </div> 
         </div> 
       
           

            {/* <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                Tomato Count: {tomatoCount}
            </div> */}

            {/* Restart Button */}
            {/* <button
                onClick={restartCount}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}
            >
                Restart Count
            </button> */}
        </div>
    );
};

export default VideoStream;
