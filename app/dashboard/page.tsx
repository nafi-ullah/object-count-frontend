"use client";
import Breadcrum from '@/components/Breadcrum';
import React, { useState } from 'react';
import { TbReload } from "react-icons/tb";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { PiClockCountdown } from "react-icons/pi";
import { PiClockCountdownFill } from "react-icons/pi";
import { GiDamagedHouse } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import FileUpload from '@/components/VideoUpload';
import Spinner from '@/components/Designs/Spinner';

interface StatCardProps {
  title: string;
  data: string | number;
  icon: React.ReactNode;
  buttonCall: () => void;
}
interface ApiResponse {
    counts: {
      object_count: string[];
      time: string[];
    };
    output_video_path: string;
    original_video: string;
  }
const StatCard: React.FC<StatCardProps> = ({ title, data, icon, buttonCall }) => {
  return (
    <div className='bg-white rounded-lg p-8 py-12 h-full flex flex-col justify-between'>
      <div className='flex justify-between'>
        <div>
          <div className='text-lg text-gray-600'>{title}</div>
          <div className='my-3 text-5xl'>{data}</div>
        </div>
        <div className='rounded-lg flex justify-center items-center w-14 h-14 bg-[#F4F7FF]'>{icon}</div>
      </div>
      <div className='mt-8'>
        <button onClick={buttonCall} className="font-semibold text-blue-700">
          <span className='flex items-center space-x-2'> <div>View Details</div> <div><FaArrowRight/></div></span>
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [showOriginal, setShowOriginal] = useState<boolean>(false);
  return (
    <div className='w-screen h-screen px-14 py-1'>
      <div className='w-full'>
        <Breadcrum />
      </div>
      <div className='w-full md:flex flex-cols md:space-x-10 space-x-0 space-y-10 md:space-y-0'>
        {/* Data show */}
        <div className='w-1/2 h-[80vh]   pt-10 '>
          <div className='grid grid-cols-2 gap-5 items-stretch h-full'>
            <StatCard 
              title='Total Count' 
              data='12' 
              icon={<TbRosetteDiscountCheck className='text-blue-500 w-6 h-6'/>} 
              buttonCall={() => { console.log('Button clicked!'); }}  
            />
                        <StatCard 
              title='Last Count Time' 
              data='12' 
              icon={<PiClockCountdown className='text-blue-500 w-6 h-6'/>} 
              buttonCall={() => { console.log('Button clicked!'); }}  
            />
                        <StatCard 
              title='Total Time' 
              data='12' 
              icon={<PiClockCountdownFill className='text-blue-500 w-6 h-6'/>} 
              buttonCall={() => { console.log('Button clicked!'); }}  
            />
                        <StatCard 
              title='Total Damage Box' 
              data='12' 
              icon={<GiDamagedHouse className='text-blue-500 w-6 h-6'/>} 
              buttonCall={() => { console.log('Button clicked!'); }}  
            />
          </div>
        </div>
        {/* Video show */}
        <div className='w-1/2'>
          {/* Video or additional content can go here */}
            <div className='bg-white rounded-lg mt-10 h-[76vh] flex flex-col items-center'>
                {!isLoading && !response && <FileUpload setIsLoading={setIsLoading} setResponse={setResponse}/> }
                {isLoading && <div><Spinner/> </div>}
                {response &&  <div className="">
                {!showOriginal && <video
          className="max-w-full max-h-[72vh]  border border-gray-300 rounded "
          controls
          src={response.output_video_path}
        />}

      {showOriginal && (
        <div className="">
          <video
            className="max-w-full max-h-[72vh]  border border-gray-300 rounded"
            controls
            src={response.original_video}
          />
        </div>
      )}
              <button
        onClick={() => setShowOriginal(!showOriginal)}
        className="px-4 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
      >
        {showOriginal ? 'Show Output Video' : 'Show Original Video'}
      </button>
                    </div>}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
