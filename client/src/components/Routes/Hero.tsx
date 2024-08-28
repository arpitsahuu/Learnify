"use client"
import { useSearchCoursesQuery } from '@/Store/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import { FaArrowDown } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import SearchCard from '../Course/SearchCard';
import { Avatar, AvatarGroup, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { motion } from "framer-motion";
import { AuroraBackground } from "../ui/aurora-background";
import { CardDemo } from '../ui/leanding-animation';

const Hero = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [boxOpen, setBoxOpen] = useState(false)
    const { data: courses, isLoading, error, refetch, isSuccess } = useSearchCoursesQuery(searchTerm, {
        skip: !triggerSearch, // Skip query until search is triggered
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTriggerSearch(true); // Allow query to run
        setBoxOpen(true)
        console.log(courses)
    };

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setBoxOpen(false);
        }
    }, [searchTerm])

    useEffect(() => {
        setTriggerSearch(false)
    }, [isSuccess])

    useEffect(() => {
        if (triggerSearch && refetch) {
            refetch(); // Trigger the query manually when the search is triggered
        }
    }, [triggerSearch, refetch]);



    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.5,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <section className='w-full pt-1 '>
                    <div className=' sm:mt-32 mt-24  text-center'>
                        <h3 className='border border-gray-300 px-3 sm:px-5 py-1 inline-block rounded-full text-[8px] md:text-sm  '>Elevate your online learnig journey! <span className=' text-blue-500 '>Read more </span></h3>

                        <h1 className=' lg:text-[60px] lg:leading-[60px]  my-3 sm:my-6 leading-[5vw] text-[5vw]  sm:text-[4.2vw] font-bold whitespace-pre sm:leading-[4vw] text-gray-800'>Unlock Your Tech Potential <br /> with Courses Designed for Success</h1>

                        <h5 className=' text-gray-600  px-2 text-center text-wrap text-[9px] sm:text-sm lg:w-[60%] md:w-[60%] sm:w-[62%]  m-auto'>Join a vibrant community of learners and professionals, dedicated to exploring the latest advancements in tech and development, and unlock new opportunities for personal and professional growth</h5>

                        <form onSubmit={handleSearch} className=' relative mt-8 w-[90%] sm:w-[700px] m-auto '>
                            <input type="text" id='search' name="serch" className='w-full sm:h-14 h-10 bg-sky-50 rounded-full pe-28  ps-10 sm:ps-16 text-gray-700 text-sm sm:text-lg shadow' placeholder='Search Courses' required onChange={(e) => setSearchTerm(e.target.value)} />
                            <button
                                type="submit"
                                className={`absolute  py-1 px-3 sm:py-2 sm:px-6  rounded-full top-1 right-1 sm:top-2 sm:right-3 text-white  ${isLoading ? "!cursor-no-drop opacity-[0.6] bg-gray-400 text-black" : "bg-[#4080ED]"}`}
                            >
                                Search
                            </button>
                            {isLoading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: green[600],
                                        position: 'absolute',
                                        top: '30px',
                                        right: '45px',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                            <div className="absolute top-[13px] left-3 sm:top-5 sm:left-5 text-gray-700">
                                <FaSearch id="searchicanbor" className="text-[15px]" />
                            </div>
                            {

                            }
                            {boxOpen &&
                                <div className={`mt-1 ${isLoading ? "opacity-0.6 !cursor-no-drop" : ""}`}>
                                    {courses?.courses && courses?.courses?.length !== 0 && courses?.courses.map((course: any) => (
                                        <div key={course._id}>
                                            <SearchCard item={course} />
                                        </div>
                                    ))}
                                    {courses?.courses?.length === 0 &&
                                        <div>
                                            <h6>no courses found with text </h6>
                                        </div>
                                    }
                                </div>
                            }
                        </form>
                        <div className='w-full flex justify-center  mt-14 sm:mb-36 mb-24 '>
                          <CardDemo/>
                        </div>
                    </div>

                </section>
            </motion.div>
        </AuroraBackground>
        // <section className='w-full h-screen pt-1 '>
        //     <div className=' sm:mt-32 mt-24  text-center'>
        //         <h3 className='border border-gray-300 px-5 py-1 inline-block rounded-full text-[8px] md:text-sm  '>Elevate your online learnig journey! <span className=' text-blue-500 '>Read more </span></h3>
        //         <h1 className=' lg:text-[60px] lg:leading-[60px]  my-3 sm:my-6 text-[6vw] leading-[6vw]  sm:text-[4.2vw] font-bold whitespace-pre sm:leading-[4vw] text-gray-800'>Unlock Your Tech Potential <br /> with Courses Designed for Success</h1>
        //         <h5 className=' text-gray-600  px-2 text-center text-wrap text-[9px] sm:text-sm lg:w-[50%] md:w-[60%] sm:w-[62%]  m-auto'>Join a vibrant community of learners and professionals, dedicated to exploring the latest advancements in tech and development, and unlock new opportunities for personal and professional growth</h5>

        //         <form onSubmit={handleSearch} className=' relative mt-8 w-[90%] sm:w-[700px] m-auto '>
        //             <input type="text" name="serch" className='w-full sm:h-14 h-10 bg-sky-50 rounded-full pe-28  ps-10 sm:ps-16 text-gray-700 text-sm sm:text-lg shadow' placeholder='Search Courses' required onChange={(e) => setSearchTerm(e.target.value)} />
        //             <button
        //                 type="submit"
        //                 className={`absolute  py-1 px-3 sm:py-2 sm:px-6  rounded-full top-1 right-1 sm:top-2 sm:right-3 text-white  ${isLoading ? "!cursor-no-drop opacity-[0.6] bg-gray-400 text-black" : "bg-[#4080ED]"}`}
        //             >
        //                 Search
        //             </button>
        //             {isLoading && (
        //                 <CircularProgress
        //                     size={24}
        //                     sx={{
        //                         color: green[600],
        //                         position: 'absolute',
        //                         top: '30px',
        //                         right: '45px',
        //                         marginTop: '-12px',
        //                         marginLeft: '-12px',
        //                     }}
        //                 />
        //             )}
        //             <div className="absolute top-[13px] left-3 sm:top-5 sm:left-5 text-gray-700">
        //                 <FaSearch id="searchicanbor" className="text-[15px]" />
        //             </div>
        //             {

        //             }
        //             {boxOpen &&
        //                 <div className={`mt-1 ${isLoading ? "opacity-0.6 !cursor-no-drop" : ""}`}>
        //                     {courses?.courses && courses?.courses?.length !== 0 && courses?.courses.map((course: any) => (
        //                         <div key={course._id}>
        //                             <SearchCard item={course} />
        //                         </div>
        //                     ))}
        //                     {courses?.courses?.length === 0 &&
        //                         <div>
        //                             <h6>no courses found with text </h6>
        //                         </div>
        //                     }
        //                 </div>
        //             }
        //         </form>

        //         <div className='w-full flex justify-center my-6'>
        //         {/* <AvatarGroup total={24}>
        //             <Avatar alt="Remy Sharp" src="/assests/avatar.png" />
        //             <Avatar alt="Travis Howard" src="/assests/avatar.png" />
        //             <Avatar alt="Agnes Walker" src="/assests/avatar.png" />
        //             <Avatar alt="Trevor Henderson" src="/assests/avatar.png" />
        //         </AvatarGroup> */}

        //         </div>
        //     </div>

        // </section>
    )
}

export default Hero