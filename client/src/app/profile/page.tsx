'use client'
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import UserProtected from "../hooks/useProtected";
import Heading from "@/components/utils/Heading";
import Navbar from "@/components/Navbar";
import ProfileInfo from "@/components/Profile/ProfileInfo";
// import Profile from "@/components/Profile/Profile";

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const {user} = useSelector((state:any) => state.auth);

  return (
    <div className="min-h-screen">
      <UserProtected>
        <Heading
          title={`${user?.name} profile - Lernigy`}
          description="ELearning is a platform for students to learn"
          keywords="Prograaming,MERN,Redux,Machine Learning, user-profile, profile,"
        />
        <Navbar
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        {/* <Profile user={user} /> */}
      </UserProtected>
    </div>
  );
};

export default Page;
