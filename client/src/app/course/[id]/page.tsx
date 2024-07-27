'use client'
import React, { useState } from "react";
import CourseDetailsPage from "../../../components/Course/CourseDetailsPage";
import Navbar from "@/components/Navbar";


const Page = ({ params }: any) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");

    return (
        <div >
            <Navbar
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
            ></Navbar>
            <CourseDetailsPage id={params.id} setRoute={setRoute} setOpen={setOpen} />
        </div>
    )
}

export default Page;
