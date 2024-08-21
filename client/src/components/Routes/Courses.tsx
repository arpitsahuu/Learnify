import { useGetUsersAllCoursesQuery } from "../../Store/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import Link from "next/link";
type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(data?.courses);
  }, [data]);
  
  
  return (
    <div>
      <div className={`w-[90%] 800px:w-[80%] m-auto`}>
        <h1 className="text-center text-[25px] leading-[35px] sm:text-2xl lg:text-3xl dark:text-white 800px:!leading-[60px] text-gray-800 font-[600] ">
          Courses
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
          {data &&
            courses?.map((item: any, index: number) => (
              <CourseCard item={item} key={index} />
            ))}
        </div>
        <Link className=" text-lg" href="courses"> View All</Link>

      </div>
    </div>
  );
};

export default Courses;
