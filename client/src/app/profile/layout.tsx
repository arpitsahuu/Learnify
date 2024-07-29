"use client"
import DashboardHeader from "@/components/Admin/DashboardHeader"
import AdminSidebar from "@/components/Admin/sidebar/AdminSidebar";
import { useEffect, useState } from "react";
import UserProtected from "../hooks/useProtected";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Set the initial value based on the current window width
    if (window.innerWidth < 1000) {
      setIsCollapsed(true);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <UserProtected>
        <div className="flex justify-between">
          <div className={isCollapsed ? `w-[100px]` : `sm:w-1/5  w-[16%] ]`}>
            <Navbar
              open={open}
              setOpen={setOpen}
              activeItem={activeItem}
              setRoute={setRoute}
              route={route}
            />
            {/* <Profile user={user} /> */}
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} role={"user"} />
          </div>
          <div className={isCollapsed ? `w-[95%]` : `w-[85%]`}>
            {children}
          </div>
        </div>
      </UserProtected>
    </section>
  )
}