"use client";
import Link from "next/link";
import React, { FC, useRef, useState } from "react";
import CustomModal from "./utils/CustomModal";
import Login from "./Auths/Login";
import Signup from "./Auths/SignUp";
import Verification from "./Auths/Verification";
import { useLoadUserQuery } from "../Store/api/apiSlice";
import { IoClose } from "react-icons/io5";
import gsap from "gsap";
import { useGSAP } from "@gsap/react"
import { duration } from "@mui/material";
import { GiHamburgerMenu } from "react-icons/gi";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

type TimelineType = {
  reversed: (value?: boolean) => boolean;
};

const Navbar: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const linkData: string[] = [ "courses", "questions"];
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const [state, setstate] = useState(true)
  const container = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);

  const tl = useRef<TimelineType | null>(null);

  const toggleTimeline = () => {
    if (tl.current) {
      tl.current.reversed(!tl.current.reversed());
    }
  };

  const smallSigninoper = async () =>{
    if(tl.current){
      await tl.current.reversed(!tl.current.reversed());
      setOpen(true)
    }
  }

  const { contextSafe } = useGSAP({ scope: container });

  useGSAP(() => {
    gsap.to
  })

  useGSAP(
    () => {
      const links = gsap.utils.toArray('.link');
      tl.current = gsap
        .timeline()
        .to(slider.current, { display:"block", right: "0", duration: 1 })
        .from(links, { x: 150, duration: 0.7, stagger: 0.28, opacity: 0 })
        .reverse();
    },
    { scope: container }
  );


  return (
    <nav ref={container} className="w-full sm:ps-20 sm:pe-10 py-5 px-2 flex justify-between items-center font-['Neue Montreal'] absolute top-0 z-50 ">
      <div className="logo">
        {" "}
        <Link href={"/"} className="text-xl">Learnify</Link>
      </div>
      <div className=" hidden sm:block">
        <div className=" links flex gap-3 items-center text-xl">
          {linkData.map((item, index) => (
            <Link
              key={index}
              href={item}
              className={`text-lg capitalize px-2 `}
            >
              {item}
            </Link>
          ))}
          {userData ?
            <Link href="/profile" className="" ><div className="flex content-center items-center px-3 py-[6px] border border-gray-400 rounded-3xl gap-1">
              <h3 className=" text-sm">{userData?.user?.name}</h3>
              <img src={userData?.user.avatar?.url} className="h-5 w-5 rounded-full " alt="Ave" />
            </div></Link> :
            <button className={` text-lg capitalize ml-32"}`} onClick={() => setOpen(true)}>Signin</button>
          }
        </div>

      </div>
      <button className="block sm:hidden" onClick={toggleTimeline}><GiHamburgerMenu /></button>
      <div ref={slider} className="  absolute top-0 right-[-100%] w-[100%] h-[100vh] bg-[#ffffff71] backdrop-blur hidden  text-4xl pt-[20vh] px-5 font-semibold z-[99999999999999999999]">
        {/* {userData ? <Link href={"Home"} className="mb-2 link block">Home</Link>: <Link href={"Home"} className="mb-2 link block">Home</Link>} */}
      <button onClick={toggleTimeline} className=" absolute top-[5%] right-[8%] "><IoClose /></button>
        { userData ?
         <Link href="/profile" className="mb-2  link block">profile</Link>:
         <button className="px-2 rounded mb-4 py-1 bg-gray-800 text-white " onClick={smallSigninoper}>Signin</button>
        }
        <Link href={"Home"} className="mb-2 link block">Home</Link>
        <Link href="/courses" className="mb-2 link block">Course</Link>
        <Link href="/questions" className="mb-2 link block">Que</Link>
        
        


      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
            />
          )}
        </>
      )}

      {route === "Sign-Up" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Signup}
            />
          )}
        </>
      )}

      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
