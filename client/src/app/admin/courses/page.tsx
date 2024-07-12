'use client'
import Heading from '../../../components/utils/Heading'
import React from 'react'
import AllCourses from "../../../components/Admin/Course/AllCourses";

type Props = {}

const page = (props: Props) => {

  return (
    <div>
      <Heading
        title="Lernigy - Admin"
        description="Lernigy is a platform for students to learn "
        keywords="Programming,MERN,Redux,Machine Learning, courses"
      />
      <AllCourses />
    </div>
  )
}

export default page