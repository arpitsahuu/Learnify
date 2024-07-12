
'use client'
import React from 'react'
import Heading from '@/components/utils/Heading';
import CourseAnalytics from "../../../components/Admin/Analytics/CourseAnalytics";

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Lernigy - Admin"
        description="Lernigy is a platform for students to learn "
        keywords="Prograaming,MERN,Redux,Machine Learning, Analytics"
      />
      <CourseAnalytics />
    </div>
  )
}

export default page