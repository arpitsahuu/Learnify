"use client";
import DashboardHero from '../../../components/Admin/DashboardHeader'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '../../../components/utils/Heading'
import React from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import AllUsers from "../../../components/Admin/Users/AllUsers";
  
type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Lernify - Admin"
          description="Lernify is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning,Team"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <AllUsers isTeam={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
