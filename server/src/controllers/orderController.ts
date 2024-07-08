import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import axios from "axios";
import { redis } from "../models/redis";
import LayoutModel from "../models/layout.model";
import { instance } from "../utils/razorpayConfig";
import Course, { ICourse } from "../models/coureModels/courseModel";
import crypto from "crypto";
import User from "../models/userModel";
import Order from "../models/orderModel";
import sendmail from "../utils/sendmail";
import Notification from "../models/notificationModel";

// CREATET ORDER
export const checkout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body);
      const { id } = req.body;
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
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      let courseId =  req.params.id ;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_APT_SECRET as string)
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        return next(new errorHandler("Payment not authorized!", 400));
      }

      const course = await Course.findById(courseId);

      if (isAuthentic && course) {
        const user = await User.findById(req.user?._id);

        user?.courses.push(course._id);
        await user?.save();

        const order = await Order.create({
          user: user?._id,
          course: courseId,
          paymentInfo: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          },
        });

        

        //SEND MEAI FOR SUCCESSFULL COURSE PURCHASE 
        try {
          if (user) {
            await sendmail(
              next,
              user?.email as string,
              "Verification code",
              "order-confirmation.ejs",
              order
            );
          }
        } catch (error: any) {
          return next(new errorHandler(error.message, 500));
        }

        await Notification.create({
          title:"New Order",
          message:`You have a new order from ${course?.name}`,
          user:user?._id
        })
        if(course){
          course.purchased = course?.purchased +1 ;
          await course.save();
        }

        res.status(200).json({
          success: true,
          order
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
