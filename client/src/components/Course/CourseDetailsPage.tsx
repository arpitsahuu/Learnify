import { useGetCourseDetailsQuery } from "../../Store/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../components/utils/Heading";
import Header from "../Navbar";
// import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIntentMutation,
  useGetRazorpayPublishablekeyQuery,
} from "../../Store/orders/ordersApi";
// import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "../../Store/api/apiSlice";

type Props = {
  id: string;
  setOpen:any;
  setRoute:any;
};

const CourseDetailsPage = ({ id ,setRoute,setOpen }: Props) => {  
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetRazorpayPublishablekeyQuery({});
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();
  const { data: userData } = useLoadUserQuery(undefined, {});
  console.log(data)



  interface Order {
    id: string;
    amount: number;
  }
  
  interface Options {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    order_id: string;
    callback_url: string;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    notes: {
      address: string;
    };
    theme: {
      color: string;
    };
  }
  
  // const checkout = async ( id: string): Promise<void> => {
  //   await createPaymentIntent(id);
  //   console.log(paymentIntentData)

  //   const options: Options = {
  //     key: data.key,
  //     amount: paymentIntentData.amount,
  //     currency: "INR",
  //     name: "Lernify",
  //     description: "Online learning platform",
  //     image: "https://avatars.githubusercontent.com/u/25058652?v=4",
  //     order_id: paymentIntentData.id,
  //     callback_url: "http://localhost:4050/v1/api/paymentverification",
  //     prefill: {
  //       name: "Gaurav Kumar",
  //       email: "gaurav.kumar@example.com",
  //       contact: "9999999999"
  //     },
  //     notes: {
  //       address: "Razorpay Corporate Office"
  //     },
  //     theme: {
  //       color: "#121212"
  //     }
  //   };

  //   const razor = new window.Razorpay(options) ;
  //   razor.open();
  // };

  
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-20">
          <Heading
            title={data?.course?.name + " - ELearning"}
            description={
              "ELearning is a programming community which is developed by shahriar sajeeb for helping programmers"
            }
            keywords={data?.course?.tags}
          />
          {/* <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          /> */}
          {data && (
            <CourseDetails
              data={data.course}
              // stripePromise={stripePromise}
              // clientSecret={clientSecret}
              setRoute={setRoute}
              setOpen={setOpen}
              // ckeckout={checkout}
            />
          )}
          {/* <Footer /> */}
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
