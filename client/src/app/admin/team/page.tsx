"use client";
import React from "react";
import Heading from '../../../components/utils/Heading'
import AllUsers from "../../../components/Admin/Users/AllUsers";

type Props = {};

const page = (props: Props) => {
  return (
    <div>

      <Heading
        title="Lernify - Admin"
        description="Lernify is a platform for students to learn and get help from teachers"
        keywords="Programming,MERN,Redux,Machine Learning,Team"
      />
      <AllUsers isTeam={true} />
    </div>
  );
};

export default page;
