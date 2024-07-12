'use client'
import React from 'react'
import CreateCourse from "../../../components/Admin/Course/CreateCourse";
import Heading from '@/components/utils/Heading';


type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Lernify - Admin"
        description="Lernigy is a platform for students to learn "
        keywords="Prograaming,MERN,Redux,Machine Learning, Create course"
      />
      <CreateCourse />
    </div>
  )
}

export default page