"use client"
import { useSearchCoursesQuery } from '@/Store/courses/coursesApi';
import React, { useEffect, useState } from 'react'
import { FaArrowDown } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import SearchCard from '../Course/SearchCard';
import { Avatar, AvatarGroup, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';

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
        <section className='w-full h-screen pt-1 '>
            <div className=' mt-32 text-center'>
                <h3 className='border border-gray-300 px-5 py-1 inline-block rounded-full  '>Elevate your online learnig journey! <span className=' text-blue-500 '>Read more </span></h3>
                <h1 className=' my-6 text-[60px] font-bold whitespace-pre leading-[60px] text-gray-800'>Unlock Your Tech Potential <br /> with Courses Designed for Success</h1>
                <h5 className=' text-gray-600 text-center text-wrap w-[50%]  m-auto'>Join a vibrant community of learners and professionals, dedicated to exploring the latest advancements in tech and development, and unlock new opportunities for personal and professional growth</h5>

                <form onSubmit={handleSearch} className=' relative mt-8 w-[700px] m-auto '>
                    <input type="text" name="serch" className='w-full h-14 bg-sky-50 rounded-full pe-28 ps-16 text-gray-700 text-lg shadow' placeholder='Search Courses' required onChange={(e) => setSearchTerm(e.target.value)} />
                    <button
                        type="submit"
                        className={`absolute  py-2 px-6 rounded-2xl top-2 right-3 text-white  ${isLoading ? "!cursor-no-drop opacity-[0.6] bg-gray-400 text-black" : "bg-[#4080ED]"}`}
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
                    <div className="absolute top-5 left-5 text-gray-700">
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

                <div className='w-full flex justify-center my-6'>
                {/* <AvatarGroup total={24}>
                    <Avatar alt="Remy Sharp" src="/assests/avatar.png" />
                    <Avatar alt="Travis Howard" src="/assests/avatar.png" />
                    <Avatar alt="Agnes Walker" src="/assests/avatar.png" />
                    <Avatar alt="Trevor Henderson" src="/assests/avatar.png" />
                </AvatarGroup> */}

                </div>
            </div>

        </section>
    )
}

export default Hero