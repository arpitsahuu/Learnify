"use client";
import Link from "next/link";
import React, { FC, useState } from "react";
import CustomModal from "./utils/CustomModal";
import Login from "./Auths/Login";
import Signup from "./Auths/SignUp";
import Verification from "./Auths/Verification";
import { useLoadUserQuery } from "../Store/api/apiSlice";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Navbar: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const linkData: string[] = ["Service", "About us", "admin"];
  const {data:userData,isLoading,refetch} = useLoadUserQuery(undefined,{});
  const [state,setstate] = useState(true)
  console.log(userData)
  return (
    <nav className="w-full px-20 py-5 flex justify-between items-center font-['Neue Montreal'] absolute top-0">
      <div className="logo">  
        {" "}
        <h3 className="text-xl">Logo</h3>
      </div>
      <div className="links flex gap-10">
        {linkData.map((item, index) => (
          <Link
            key={index}
            href={item} 
            className={`text-lg capitalize ${index === 3 && "ml-32"}`}
          >
            {item}
          </Link>
        ))}
        {/* <Link href="/admin">Dasboard</Link> */}
        {/* { userData ?
        <button className={` text-lg capitalize ml-32"}`} onClick={() => setOpen(true)}>Sign in</button> : <button>{userData?.user.name}</button>
         } */}
         {userData? <Link href="/profile">{userData?.user?.name}</Link>:<button className={` text-lg capitalize ml-32"}`} onClick={() => setOpen(true)}>Sign in</button> }
         
         {/* <button className={` text-lg capitalize ml-32"}`} onClick={() => setOpen(true)}>Sign in</button> */}
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
