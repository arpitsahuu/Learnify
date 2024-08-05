'use client'
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import Heading from "@/components/utils/Heading";
import UserProtected from "@/app/hooks/useProtected";
import ChangePassword from "@/components/Profile/ChangePassword";
import ShowCourses from "@/components/Profile/ShowCourses";

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const {user} = useSelector((state:any) => state.auth);

  return (
    <div className="min-h-screen">
      <UserProtected>
        <Heading
          title={`${user?.name} profile - Lernigy`}
          description="ELearning is a platform for students to learn"
          keywords="Prograaming,MERN,Redux,Machine Learning, user-profile, profile,"
        />
        <ShowCourses  courses={user?.courses} />
      </UserProtected>
    </div>
  );
};

export default Page;
