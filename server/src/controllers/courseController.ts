import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import axios from "axios";
import Course, {ICourse} from "../models/coureModels/courseModel"

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "dcj2gzytt",
  api_key: process.env.CLOUDINARY_PUBLIC_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// // upload course
// export const uploadCourse = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = req.body;
//       console.log("enter")
//       console.log(data)
//       // const thumbnail = data.thumbnail;
//       // if (thumbnail) {
//       //   const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
//       //     folder: "courses",
//       //   });

//       //   data.thumbnail = {
//       //     public_id: myCloud.public_id,
//       //     url: myCloud.secure_url,
//       //   };
//       // }
//       // createCourse(data, res, next);
//       res.json({
//         rea:"hello"
//       })
//     } catch (error: any) {
//       return next(new errorHandler(error.message, 500));
//     }
//   }
// );

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



  // GENERATE THE VIDEOURL
export const uploadCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body;
      console.log(data)
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      console.log(data);
      const course = await Course.create(data);
      console.log(course)
      res.status(201).json({
        success:true,
        course
      });
      
    } catch (error: any) {
      console.log(error)
      return next(new errorHandler(error.message, 500));
  }
  }
);