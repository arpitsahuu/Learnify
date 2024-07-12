'use client'
import React from 'react'
import Heading from '@/components/utils/Heading';
import UserAnalytics from '../../../components/Admin/Analytics/UserAnalytics';

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Lernigy - Admin"
        description="Lernigy is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <UserAnalytics />
    </div>
  )
}

export default page