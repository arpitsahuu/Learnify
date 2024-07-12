"use client";
import React from "react";
import AdminProtected from "../hooks/adminProtected";
// import DashboardHero from "../components/Admin/DashboardHero";
import Heading from "@/components/utils/Heading";
import AdminSidebar from "@/components/Admin/sidebar/AdminSidebar";
import DashboardHero from "@/components/Admin/DashboardHero";


type Props = {};

const page = (props: Props) => {
  return (
    <div>
      {/* <AdminProtected> */}
        <Heading
          title="Elearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
            <DashboardHero isDashboard={true} />
        {/* <div className="flex min-h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
            
          </div>
          <div className="w-[85%]">
          </div>
        </div> */}
      {/* </AdminProtected> */}
    </div>
  );
};

export default page;
