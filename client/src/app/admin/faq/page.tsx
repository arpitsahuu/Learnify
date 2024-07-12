"use client";
import React from "react";
import Heading from "../../../components/utils/Heading";
import EditFaq from "../../../components/Admin/Customization/EditFaq";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Lernigy - Admin"
        description="Lernigy is a platform for students to learn "
        keywords="Programming,MERN,Redux,Machine Learning,Questions"
      />
      <EditFaq />
    </div>
  );
};

export default page;
