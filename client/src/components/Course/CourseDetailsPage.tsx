import { useGetCourseDetailsQuery } from "../../Store/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../components/utils/Heading";
import Header from "../Navbar";
// import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
// import {
//   useCreatePaymentIntentMutation,
//   useGetStripePublishablekeyQuery,
// } from "../../Store/";
// import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "../../Store/api/apiSlice";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  // const { data: config } = useGetStripePublishablekeyQuery({});
  // const [createPaymentIntent, { data: paymentIntentData }] =
  //   useCreatePaymentIntentMutation();
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  // useEffect(() => {
  //   if (config) {
  //     const publishablekey = config?.publishablekey;
  //     setStripePromise(loadStripe(publishablekey));
  //   }
  //   if (data && userData?.user) {
  //     const amount = Math.round(data.course.price * 100);
  //     createPaymentIntent(amount);
  //   }
  // }, [config, data, userData]);

  // useEffect(() => {
  //   if (paymentIntentData) {
  //     setClientSecret(paymentIntentData?.client_secret);
  //   }
  // }, [paymentIntentData]);
  console.log(data)

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
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
            />
          )}
          {/* <Footer /> */}
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
