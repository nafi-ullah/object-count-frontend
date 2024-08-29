"use client";
import Breadcrum from '@/components/Breadcrum';
import React from 'react';
import { TbReload } from "react-icons/tb";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { PiClockCountdown } from "react-icons/pi";
import { PiClockCountdownFill } from "react-icons/pi";
import { GiDamagedHouse } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";

interface StatCardProps {
  title: string;
  data: string | number;
  icon: React.ReactNode;
  buttonCall: () => void;
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
  return (
    <div className='w-screen h-screen px-14 py-1'>
      <div className='w-full'>
        <Breadcrum />
      </div>
      <div className='w-full flex'>
        {/* Data show */}
        <div className='w-1/2 h-[80vh]  py-3 pt-10 '>
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
