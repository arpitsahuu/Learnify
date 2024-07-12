"use client";
import Heading from "../../../components/utils/Heading";
import React from "react";
import EditCategories from "../../../components/Admin/Customization/EditCategories";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Lernigy - Admin"
        description="Lernigy is a platform for students to learn "
        keywords="Programming,MERN,Redux,Machine Learning,Admin,categoriess"
      />
      <EditCategories />
    </div>
  );
};

export default page;
