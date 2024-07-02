import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import { redis } from "../models/redis";
import { generateLast12MothsData } from "../utils/analyticsGenerator";
import User from "../models/userModel";
import Course from "../models/coureModels/courseModel";
import Order from "../models/orderModel";

// get users analytics --- only for admin
export const getUsersAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await generateLast12MothsData(User);
  
        res.status(200).json({
          success: true,
          users,
        });
      } catch (error: any) {
        return next(new errorHandler(error.message, 500));
      }
  }
);

// get courses analytics --- only for admin
export const getCoursesAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courses = await generateLast12MothsData(Course);

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

// GET LAYOUT BY TYPE
export const getOrderAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await generateLast12MothsData(Order);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);
