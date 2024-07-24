 'use client'
import CourseContent from "../../../../src/components/Course/CourseContent";
import Loader from "../../../components/Loader/Loader";
import { useLoadUserQuery } from "../../../Store/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
    params:any;
}

const Page = ({params}: Props) => {
    const id = params.id;
  const { isLoading, error, data,refetch } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    const id = params ? params.id : null;
    if (data) {
      const isPurchased = data.user.courses.find(
        (item: any) => item?._id === id
      );
      if (!isPurchased) {
        redirect("/");
      }
    }
    if (error) {
      redirect("/");
    }
  }, [data,error,params]);

  return (
   <>
   {
    isLoading ? (
        <Loader />
    ) : (
        <div>
          <CourseContent id={id} user={data.user} />
        </div>
    )
   }
   </>
  )
}

export default Page