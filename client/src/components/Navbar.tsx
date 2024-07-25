"use client";
import Link from "next/link";
import React, { FC, useState } from "react";
import CustomModal from "./utils/CustomModal";
import Login from "./Auths/Login";
import Signup from "./Auths/SignUp";
import Verification from "./Auths/Verification";
import { useLoadUserQuery } from "../Store/api/apiSlice";
import { IoClose } from "react-icons/io5";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Navbar: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const linkData: string[] = ["Service", "About us", "admin"];
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const [state, setstate] = useState(true)
  console.log(userData)
  return (
    <nav className="w-full ps-20 pe-10 py-5 flex justify-between items-center font-['Neue Montreal'] absolute top-0">
      <div className="logo">
        {" "}
        <h3 className="text-xl">Logo</h3>
      </div>
      <div className="links flex gap-10">
        {/* {linkData.map((item, index) => (
          <Link
            key={index}
            href={item} 
            className={`text-lg capitalize ${index === 3 && "ml-32"}`}
          >
            {item}
          </Link>
        ))} */}
        <Link
          href="/que"
          data-blobity-magnetic="false"
          aria-label="Navigate to Home Page"
          className={`text-lg capitalize`}
        >
          Home
        </Link>
        <Link
          href="/que"
          className={`text-lg capitalize`}
          data-blobity-magnetic="false" 
          aria-label="Scroll to Courses Page"
        >
          Courses
        </Link>
        <Link
          href="/que"
          data-blobity-magnetic="false" 
          aria-label="Scroll to Que Page"
          className={`text-lg capitalize hover:text-white `}
        >
          QUE
        </Link>

        {/* <Link href="/admin">Dasboard</Link> */}
        {/* { userData ?
        <button className={` text-lg capitalize ml-32"}`} onClick={() => setOpen(true)}>Sign in</button> : <button>{userData?.user.name}</button>
         } */}
        {userData ? <Link href="/profile">{userData?.user?.name}</Link> : <button className={` text-lg capitalize ml-32"}`} onClick={() => setOpen(true)}>Signin</button>}

        {/* <button className={` text-lg capitalize ml-32"}`} onClick={() => setOpen(true)}>Sign in</button> */}
      </div>
      <div className=" absolute top-0 right-[-40%] w-[500px] h-[100vh] bg-[#ffffff71] backdrop-blur flex flex-col text-4xl pt-[20vh] px-5 font-semibold">
        <Link href={"Home"} className="mb-2">Home</Link>
        <Link href={"Home"} className="mb-2">Course</Link>
        <Link href={"Home"} className="mb-2">Que</Link>
        <Link href={"Home"} className="mb-2">Signin</Link>
        <button className=" absolute top-[5%] right-[8%] "><IoClose /></button>

        
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
