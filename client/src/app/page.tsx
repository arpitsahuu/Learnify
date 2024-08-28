"use client"
import Hero from "@/components/Routes/Hero";
import Navbar from "@/components/Navbar";
import Heading from "@/components/utils/Heading";
import { useEffect, useState } from "react";
import Courses from "@/components/Routes/Courses";
// import LocomotiveScroll from 'locomotive-scroll';

export default function Home() {

  // const locomotiveScroll = new LocomotiveScroll();

  // const blobityInstance = useBlobity({
  //   licenseKey: "opensource",
  //   focusableElementsOffsetX: 5,
  //   focusableElementsOffsetY: 5,
  //   color: "#008000",
  //   dotColor: "#ff0000",
  //   fontColor: "#A020F0",
  //   radius: 4,
  //   magnetic: true,
  // });
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  // useEffect(() => {
  //   if (blobityInstance.current) {
  //     // @ts-ignore for debugging purposes or playing around
  //     window.blobity = blobityInstance.current;
  //   }
  // }, [blobityInstance]);

  return (
    <main className=" w-full">
      <Heading
        title="Learnify"
        description="Lernify is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <Navbar
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      ></Navbar>
      <Hero></Hero>
      <Courses />
    </main>
  );
}

