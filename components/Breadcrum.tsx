import React from 'react'
import { TfiAlignJustify } from "react-icons/tfi";
import { TbReload } from "react-icons/tb";
const Breadcrum = () => {
  return (
    <div className='w-full h-24 p-2 px-12 flex justify-between items-center bg-white  rounded-lg'>
        <div className='flex items-center space-x-3'>
            <div className='flex justify-center items-center p-2 rounded-full border-[1px] border-gray-500'>
                <TfiAlignJustify className='w-6 h-6'/>
            </div>
             <div>Dashboard</div>
        </div>
        <div className='flex justify-center items-center p-2 rounded-full border-[1px] border-gray-500'>
                <TbReload className='w-6 h-6'/>
            </div>
    </div>
  )
}

export default Breadcrum