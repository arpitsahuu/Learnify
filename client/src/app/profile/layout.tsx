"use client"
import DashboardHeader from "@/components/Admin/DashboardHeader"
import AdminSidebar from "@/components/Admin/sidebar/AdminSidebar";
import { useState } from "react";
import UserProtected from "../hooks/useProtected";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <UserProtected>
        <div className="flex justify-between">
          <div className={isCollapsed?`w-[100px]`:`sm:w-1/5  w-[16%] ]`}>
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}  />
          </div> 
          <div className={isCollapsed?`w-[95%]`:`w-[85%]`}>
            <DashboardHeader  open={open} setOpen={setOpen}  />
            {children}
          </div>
        </div>
      </UserProtected>
    </section>
  )
}