import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import { instance } from "../utils/razorpayConfig";
import Course, { ICourse } from "../models/coureModels/courseModel";
import crypto from "crypto";
import User from "../models/userModel";
import Order from "../models/orderModel";
import sendmail from "../utils/sendmail";
import Notification from "../models/notificationModel";
import dotenv from 'dotenv';
import { redis } from "../models/redis";
dotenv.config();

// CREATET ORDER
export const checkout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body);
      const { id } = req.body;
      console.log(id)
      // const user = req.user;
      const course = await Course.findById(id);
      if (!course) {
        return next(new errorHandler("Wrong Course ID", 400));
      }
      // const reqamout = course?.price;
      let options = {
        amount: course?.price * 100,
        currency: "INR",
      };
      const order = await instance.orders.create(options);
      console.log(order);
      res.json({
        order,
        courseID: course._id,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

// GET ROZORPAYKEY API KEY
export const getRozorpaykey = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(200).json({
      key: process.env.RAZORPAY_API_KEY,
    });
  }
);

// VERIFY THE PAYMENT
export const paymentVerification = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body)
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      let courseId = req.params.id ;
      console.log(courseId)

      console.log('RAZORPAY_API_SECRA:', process.env.RAZORPAY_API_SECRAT);

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      console.log(body)

      const expectedSignature = await crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRAT as string)
        .update(body.toString())
        .digest("hex");

        console.log(expectedSignature)

      const isAuthentic = expectedSignature === razorpay_signature;
      console.log(isAuthentic)

      if (!isAuthentic) {
        return next(new errorHandler("Payment not authorized!", 400));
      }

      const course = await Course.findById(courseId);

      if (isAuthentic && course) {
        const user = await User.findById(req.user?._id);

        user?.courses.push(course._id);
        console.log(user)
        await user?.save();
        const updateuser = await User.findById(user?._id).populate("courses").exec();
        await redis.set(user?._id,JSON.stringify(updateuser));

        const order = await Order.create({
          user: user?._id,
          course: courseId,
          paymentInfo: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          },
        });
        console.log(order)

        const maildata = {
          name:course.name,
          orde_id:order._id,
          course:course.price,
          order:{
            name:course.name,
          orde_id:order._id,
          price:course.price,
          }
        }

        console.log("mail")

        //SEND MEAI FOR SUCCESSFULL COURSE PURCHASE 
        try {
          if (req?.user) {
            await sendmail(
              next,
              user?.email as string,
              "Verification code",
              "order-confirmation.ejs",
              maildata
            );
          }
        } catch (error: any) {
          return next(new errorHandler(error.message, 500));
        }
        console.log("send mail")
        await Notification.create({
          title:"New Order",
          message:`You have a new order from ${course?.name}`,
          user:user?._id
        })
        console.log("noteficarion")
        if(course){
          course.purchased = course?.purchased +1 ;
          await course.save();
        }

        res.status(200).json({
          success: true,
          order, 
          updateuser
        })
      } else {
        res.status(400).json({
          success: false,
        });
      }
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);
