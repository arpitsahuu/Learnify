"use client"
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Heading from "@/components/utils/Heading";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  return (
    <main className="flex min-h-screen ">
      <main className="w-full">
      <Heading
        title="Lernify"
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
    </main>
    </main>
  );
}
