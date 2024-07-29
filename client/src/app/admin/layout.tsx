"use client"
import DashboardHeader from "@/components/Admin/DashboardHeader"
import AdminProtected from "../hooks/adminProtected"
import AdminSidebar from "@/components/Admin/sidebar/AdminSidebar";
import { useState } from "react";

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
      <AdminProtected>
        <div className="flex justify-between">
          <div className={isCollapsed?`w-[100px]`:`sm:w-1/5  w-[16%] ]`}>
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} role={"admin"}  />
          </div> 
          <div className={isCollapsed?`w-[95%]`:`w-[85%]`}>
            <DashboardHeader  open={open} setOpen={setOpen}  />
            {children}
          </div>
        </div>
      </AdminProtected>
    </section>
  )
}