import { styles } from "@/app/styles/style";
import CoursePlayer from "../../components/utils/CoursePlayer";
import Ratings from "../../components/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "../Course/CourseContentList";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckOutForm from "../Payment/CheckOutForm";x
import { useLoadUserQuery } from "../../Store/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";
import {
  useCreatePaymentIntentMutation,
  useGetRazorpayPublishablekeyQuery,
} from "../../Store/orders/ordersApi";
import { useRouter } from "next/navigation";
import axios from "axios";

type Props = {
  data: any;
  // stripePromise: any;
  // clientSecret: string;
  setRoute: any;
  setOpen: any;
};

const CourseDetails = ({
  data,
  // stripePromise,
  // clientSecret,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {


  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);
  const router = useRouter();



  interface PaymentSuccessQuery {
    status: string;
    order_id: string;
    amount: string;
  }


  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const dicountPercentenge =
    ((data?.estimatedPrice - data.price) / data?.estimatedPrice) * 100;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);
  console.log(user)
  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id);
  console.log(isPurchased)

  const { data: config } = useGetRazorpayPublishablekeyQuery({});
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();

  // const x = async (id:string) => {
  //   if (user) {
  //     // setOpen(true);
  //     console.log("enter")
  //     await ckeckout(id);
  //   } else {
  //     setRoute("Login");
  //     openAuthModal(true);
  //   }
  // };
  const checkout = async (e: any, id: string): Promise<void> => {
    const res = await createPaymentIntent(id);
    console.log(res)
    // console.log(paymentIntentData)

    const options = {
      key: data.key,
      amount: res?.data?.order?.amount,
      currency: "INR",
      name: "Lernify",
      description: "Online learning platform",
      image: "https://avatars.githubusercontent.com/u/121677470?s=400&u=48419f81cd2899ec6353f7ee83aa00e28e8b9bfb&v=4",
      order_id: res?.data?.order?.id,
      callback_url: `http://localhost:4050/api/v1/paymentVerification/${data._id}`,
      handler:async function (response: any) {
        const callbackresponse = await axios.post(`http://localhost:4050/api/v1/paymentVerification/${data._id}`,{
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        })
        console.log(callbackresponse);
        window.location.href =`${window.location.origin}/payment/${response.data?.razorpay_order_id}`

      },
      prefill: {
        name: `${user.name}`,
        email: "gaurav.kumar@example.com",
      },
      notes: {
        address: "Razorpay Corporate Office"
      },
      theme: {
        color: "#121212"
      }
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };


  const x = async (e: any, id: string) => {
    e.preventDefault()
    console.log("enter")
    if (user) {
      setOpen(true);
      await checkout(e, id);
    } else {
      console.log("enter else")
      setRoute("Login");
      openAuthModal(true);
    }
  }


  return (
    <div>
      <div className="w-[90%] sm:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse sm:flex-row">
          <div className="w-full sm:w-[65%] sm:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data.purchased} Students
              </h5>
            </div>

            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What you will learn from this course?
            </h1>
            <div>
              {data.benefits?.map((item: any, index: number) => (
                <div
                  className="w-full flex sm:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for starting this course?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex sm:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            {/* course description */}
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="sm:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 sm:mb-[unset]" />
                {/* { data?.rating?.length !== 0 &&
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Course Rating • {data?.reviews?.length} Reviews
                </h5>
                } */}
              </div>
              <br />
              {/* {(data?.reviews && [...data.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    <div className="flex">
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={
                            item.user.avatar
                              ? item.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="hidden sm:block pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">
                            {item.user.name}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                        <p className="text-black dark:text-white">
                          {item.comment}
                        </p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item.createdAt)} •
                        </small>
                      </div>
                      <div className="pl-2 flex sm:hidden items-center">
                        <h5 className="text-[18px] pr-2 text-black dark:text-white">
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                    </div>
                    {item.commentReplies.map((i: any, index: number) => (
                      <div className="w-full flex sm:ml-16 my-5" key={index}>
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={
                              i.user.avatar
                                ? i.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                            <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                          </div>
                          <p>{i.comment}</p>
                          <small className="text-[#ffffff83]">
                            {format(i.createdAt)} •
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )} */}
            </div>
          </div>
          <div className="w-full sm:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "Free" : data.price + "₹"}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  {data.estimatedPrice}₹
                </h5>

                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentengePrice}% Off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Enter to Course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    onClick={(e) => x(e, data._id)}
                  >
                    Buy Now {data.price}₹
                  </div>
                )}
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">
                • Source code included
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Full lifetime access
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Certificate of completion
              </p>
              <p className="pb-3 sm:pb-1 text-black dark:text-white">
                • Premium Support
              </p>
            </div>
          </div>
        </div>
      </div>
      <>
        {/* {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckOutForm setOpen={setOpen} data={data} user={user} refetch={refetch} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )} */}
      </>
    </div>
  );
};

export default CourseDetails;
