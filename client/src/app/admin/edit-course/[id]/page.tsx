'use client'
import React from 'react'
import Heading from '@/components/utils/Heading';
import EditCourse from '@/components/Admin/Course/EditCourse';



type Props = {}

const page = ({ params }: any) => {
  const id = params?.id;

  return (
    <div>
      <Heading
        title="Lernigy - Admin"
        description="Lernigy is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <EditCourse id={id} />
    </div>
  )
}

export default page