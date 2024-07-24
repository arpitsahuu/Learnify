import React from 'react'
import { FaArrowDown } from "react-icons/fa";

const Hero = () => {
    return (
        <section className='w-full h-screen pt-1 '>
            <div className='textstructure mt-32 px-20'>
                {["We Create", "Eye Opning", "Presentation"].map((item, index) => (
                    <div className='masker' key={index}>
                        <div className='w-fit flex items-end overflow-hidden'>

                            {index === 1 &&
                                <div className='mr-5 w-[8vw] rounded-md h-[5vw] bottom-0 relative bg-green-500  '></div>
                            }
                            <h1 className=" pt-[.8vw] mb-1 uppercase text-[7vw] leading-[.75] font-bold font-['Test Founders Grotest X-Cond Sm Semi Bold'] text-[#212121] tracking-tightest ">{item}</h1>
                        </div>
                    </div>
                ))}
            </div>
            <div className=' border-t-[2px] mt-32 flex justify-between  items-center py-5 px-10 text-gray-700'>
                {["for Public and Pricate Company","From First Pich to IPO"].map((item,index) =>(
                    <h4 key={index} className=' capitalize'>{item}</h4>
                ))}
                <div className='flex justify-center items-center'>
                <button className=' border-[1px] border-slate-700 px-4 py-1 rounded-full uppercase '>Start Your learning</button>
                <div className='border-[1px] border-slate-700 p-2 ms-2 rounded-full text-gray-700 '>

                <FaArrowDown  /> 
                </div>
                </div>
                
            </div>

        </section>
    )
}

export default Hero