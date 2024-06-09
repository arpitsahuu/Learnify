// import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
type Props = {};

const Courses = (props: Props) => {
  // const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  // useEffect(() => {
  //   setCourses(data?.courses);
  // }, [data]);
  const sampleCourses = [
    {
      _id: "1",
      name: "Introduction to JavaScript",
      thumbnail: { url: "" },
      ratings: 4.5,
      purchased: 120,
      price: 49.99,
      estimatedPrice: 79.99,
      courseData: [{}, {}, {}], // Assuming courseData contains lectures
    },
    {
      _id: "2",
      name: "Advanced CSS Techniques",
      thumbnail: { url: "" },
      ratings: 4.0,
      purchased: 85,
      price: 29.99,
      estimatedPrice: 59.99,
      courseData: [{}, {}, {}, {}, {}],
    },
    {
      _id: "3",
      name: "React for Beginners",
      thumbnail: { url: "" },
      ratings: 4.8,
      purchased: 150,
      price: 39.99,
      estimatedPrice: 69.99,
      courseData: [{}, {}, {}, {}, {}, {}, {}],
    },
  ];
  
  return (
    <div>
      <div className={`w-[90%] 800px:w-[80%] m-auto`}>
        <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
          Expand Your Career <span className="text-gradient">Opportunity</span>{" "}
          <br />
          Opportunity With Our Courses
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
          {sampleCourses &&
            sampleCourses.map((item: any, index: number) => (
              <CourseCard item={item} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
