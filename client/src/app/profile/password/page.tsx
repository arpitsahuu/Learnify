'use client'
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import Heading from "@/components/utils/Heading";
import Navbar from "@/components/Navbar";
// import ProfileInfo from "@/components/Profile/ProfileInfo";
import Profile from "@/components/Profile/Profile";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import UserProtected from "@/app/hooks/useProtected";
import ChangePassword from "@/components/Profile/ChangePassword";

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
        <ChangePassword  />
      </UserProtected>
    </div>
  );
};

export default Page;
