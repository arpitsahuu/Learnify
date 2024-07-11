'use client'
import React from 'react'
import AdminSidebar from "@/components/Admin/sidebar/AdminSidebar";
import DashboardHeader from '../../../components/Admin/DashboardHeader';
import Heading from '@/components/utils/Heading';
import UserAnalytics from '../../../components/Admin/Analytics/UserAnalytics';
import AdminProtected from '@/app/hooks/adminProtected';

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Prograaming,MERN,Redux,Machine Learning"
        />
        <div className="flex">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <UserAnalytics />
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default page