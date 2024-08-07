import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import axios from "axios";
import Course, { ICourse } from "../models/coureModels/courseModel";

import cloudinary from "cloudinary";
import { redis } from "../models/redis";
import CourseData from "../models/coureModels/courseData";

cloudinary.v2.config({
  cloud_name: "dcj2gzytt",
  api_key: process.env.CLOUDINARY_PUBLIC_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// GENERATE THE VIDEOURL
export const generateVideoUrl = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

// CREATE NEW COURSE
export const uploadCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let {
        name,
        description,
        price,
        categories,
        estimatedPrice,
        thumbnail,
        tags,
        level,
        demoUrl,
        benefits,
        prerequisites,
        reviews,
        rating,
        purchased,
        totalVideos,
        courseData,
      } = req.body;
      const data = req.body;
      console.log(data);
      const courseDataIds = [];
      if (courseData && courseData.length > 0) {
        for (const data of courseData) {
          const newCourseData = new CourseData(data);
          const savedCourseData = await newCourseData.save();
          courseDataIds.push(savedCourseData._id);
        }
      }
      const ismg = req.file;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      // Create a new course instance with the created CourseData ObjectIds
      const newCourse = new Course({
        name,
        description,
        price,
        categories,
        estimatedPrice,
        thumbnail,
        tags,
        level,
        demoUrl,
        benefits,
        prerequisites,
        reviews,
        rating,
        purchased,
        totalVideos,
        courseData: courseDataIds,
      });

      // Save the course to the database
      const savedCourse = await newCourse.save();
      res.status(201).json({
        success: true,
        course: savedCourse,
      });
    } catch (error: any) {
      console.log(error);
      return next(new errorHandler(error.message, 500));
    }
  }
);

//EDIT COURSE
export const editCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;

      const courseId = req.params.id;

      const courseData = (await Course.findById(courseId)) as any;

      if (thumbnail && !thumbnail.startsWith("https")) {
        await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: courseData?.thumbnail.public_id,
          url: courseData?.thumbnail.url,
        };
      }

      const course = await Course.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );
      await redis.set(courseId, JSON.stringify(course)); // update course in redis
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

//EDIT COURSE
export const deltetCours = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const course = await Course.findById(id);
      if (!course) {
        return next(new errorHandler("Indalid course ID", 401));
      }
      if (course?.thumbnail) {
        const thumbnail = course.thumbnail;
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
      }
      await Course.findByIdAndDelete(id);

      res.status(201).json({
        success: true,
        message: "succesfully deleted",
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

//Get Single Course
export const getSingleCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.id;
      console.log(courseId);

      const isCacheExist = await redis.get(courseId);
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await Course.findById(req.params.id)
          .populate("courseData")
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
          );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

//Get All Courses
export const getAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courses = await Course.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

//get course content -- only for valid user
export const getCourseByUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new errorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await Course.findById(courseId).populate("courseData");

      const content = course?.courseData;

      console.log(content);

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

// get all courses --- only for admin
export const getAdminAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courses = await Course.find().sort({ createdAt: -1 });

      
      res.status(201).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 400));
    }
  }
);

//Search Courses
export const searchCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    async function searchCourses(query: string) {
      const searchRegex = new RegExp(query, "i"); // 'i' for case-insensitive

      const queryObj = {
        name: { $regex: searchRegex },
      };

      return Course.find(queryObj).select('name price thumbnail level categories');
    }
    try {
      const searchQuery = req.query.q  ;
      if(!searchQuery){
        return next(new errorHandler("Provide search Text",401))
      }

      const courses = await searchCourses(searchQuery as string)
      console.log(courses)

      res.status(201).json({
        success:true,
        courses,
      })

    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);
