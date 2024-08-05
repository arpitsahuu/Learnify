import React, { FC } from 'react'
import CourseCard from '../Course/CourseCard';

type Props = {
    courses: any;
};

const ShowCourses: FC<Props> = ({courses}) => {
    return (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-[80px]">
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                {courses &&
                    courses.map((item: any, index: number) => (
                        <CourseCard item={item} key={index} isProfile={true} />
                    ))}
            </div>
            {courses.length === 0 && (
                <h1 className="text-center text-[18px] font-Poppins dark:text-white text-black">
                    You don&apos;t have any purchased courses!
                </h1>
            )}
        </div>
    )
}

export default ShowCourses