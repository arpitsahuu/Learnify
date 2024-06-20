// const { catchAsyncErron } = require("../middlewares/catchAsyncError");
// const errorHandler = require("../utils/errorHandler");
// const User = require("../models/userModel");
// const sendmail = require("../utils/sendmail");
// const activationToken = require("../utils/activationToken");
// const jwt = require("jsonwebtoken");
// const generateTokens = require("../utils/generateTokens");
// const redis = require("../models/redis");
// const cloudinary = require("cloudinary").v2;
// const Course = require("../models/coureModels/courseModel");
// const CourseData = require("../models/coureModels/courseData");
// const Query = require("../models/coureModels/questionModel");
// const Review = require("../models/coureModels/reviewModel");
import { catchAsyncError } from "../middlewares/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import User, { IUser } from "../models/userModel";
import { Interface } from "readline";
import { NextFunction, Request, Response } from "express";
import sendmail from "../utils/sendmail";
import { activationToken } from "../utils/activationToken";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/generateTokens";
import { redis } from "../models/redis";
import CourseData from "../models/coureModels/courseData";
import Query from "../models/coureModels/questionModel";

export const homepage = catchAsyncError(
  (req: Request, res: Response, next: NextFunction) => {}
);

// User Interface

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  contact?: number;
}

// SEND ACTIVATION CODE AND TOKEN TO VERIFY USER EMAIL

export const userRegistration = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const requestBody: IRegistrationBody = req.body as IRegistrationBody ;
    const { name, email, password, contact } = req.body as IRegistrationBody;

    if (!name || !email || !password || !contact)
      return next(new errorHandler(`fill all deatils`));

    const isEmailExit = await User.findOne({ email: email });
    if (isEmailExit)
      return next(
        new errorHandler("User With This Email Address Already Exits")
      );

    const ActivationCode = Math.floor(1000 + Math.random() * 9000);

    const user: IRegistrationBody = {
      name,
      email,
      password,
    };
    if (contact) {
      user.contact = contact;
    }

    console.log("enter");
    const data: object = { name: name, activationCode: ActivationCode };

    try {
      await sendmail(
        next,
        email,
        "Verification code",
        "activationMail.ejs",
        data
      );
      console.log("extracted");
      let token = await activationToken(user, ActivationCode);
      let options = {
        httpOnly: true,
        secure: true,
      };
      res.status(200).cookie("token", token, options).json({
        succcess: true,
        message: "successfully send mail pleas check your Mail",
        token,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 400));
    }
  }
);

interface IActivationCode {
  activationCode: string;
}

// REGISTER USER AFTER MAIL VERIFICATION .

export const userActivation = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let { activationCode } = req.body as IActivationCode;

    if (!activationCode)
      return next(new errorHandler("Provide Activation Code"));

    const { token } = req.cookies;

    let tokenInof: { user: IRegistrationBody; ActivationCode: string } =
      (await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string)) as {
        user: IRegistrationBody;
        ActivationCode: string;
      };

    const isEmailExit = await User.findOne({ email: tokenInof.user.email });
    if (isEmailExit)
      return next(
        new errorHandler("User With This Email Address Already Exits")
      );

    if (activationCode != tokenInof?.ActivationCode)
      return next(new errorHandler("Wrong Activation Code"));

    let { name, email, password, contact } = tokenInof.user;

    const newUser = await User.create({
      name,
      email,
      password,
      contact,
      isVerified: true,
    });

    const tokens = generateTokens(newUser);
    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };

    res
      .status(201)
      .cookie("accessToken", tokens?.accessToken, options)
      .cookie("refreshToken", tokens?.refreshToken, options)
      .json({
        succcess: true,
        message: "successfully register",
        user: newUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens?.refreshToken,
      });
  }
);

interface IloginReques {
  email: string;
  password: string;
}

// LOGIN USER WIHT EMAIL AND PASSWORD

export const userLogin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as IloginReques;
    if (!email || !password)
      return next(new errorHandler("Pleas fill all details"));

    const user: IUser | null = await User.findOne({ email: email })
      .select("+password")
      .exec();
    if (!user)
      return next(new errorHandler("User Not Found With this Email", 404));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new errorHandler("Wrong Credientials", 500));

    interface Itokeninterfat {
      accessToken: string;
      refreshToken: string;
    }

    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();
    user.password = "";

    await redis.set(user._id, JSON.stringify(user));

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", tokens?.accessToken, options)
      .cookie("refreshToken", tokens?.refreshToken, options)
      .json({
        succcess: true,
        message: "successfully login",
        user: user,
        accesToken: tokens?.accessToken,
        refreshToken: tokens?.accessToken,
      });
  }
);

// LOGOUT USER

export const userLongOut = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, {
      $set: {
        refreshToken: undefined,
      },
    });

    await redis.del(id);
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .clearCookie("accesToken", options)
      .clearCookie("refreshToken", options)
      .json({
        succcess: true,
        message: "successfully logout",
      });
  }
);

// export const refresh = catchAsyncError(async (rreq:Request, res:Response, next:NextFunction) => {
//   const token =
//     req.cookies?.refreshToken ||
//     req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return next(new errorHandler("Unauthorized request", 401));
//   }

//   // check user in cache
//   const session = await redis.get(decoded._id);
//   if (!session) {
//     return next(new errorHandler("Could Not Refresh Token", 400));
//   }

//   const user = JSON.parse(session);
// });

// TO GET USERS INFORMATION.

export const userInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    // Attempt to retrieve user data from Redis
    let user = await redis.get(id);

    // If user data is not found in Redis
    if (!user) {
      try {
        // Attempt to find user in MongoDB
        const foundUser: IUser | null = await User.findById(id);

        // If user not found in MongoDB, return an error
        if (!foundUser) return next(new errorHandler("User not found", 404));

        // Convert user object to string and set it in Redis
        await redis.set(id, JSON.stringify(foundUser));

        // Send user data in the response
        return res.status(200).json({
          success: true,
          user: foundUser,
        });
      } catch (error: any) {
        // If an error occurs during database query, pass it to the error handler middleware
        return next(new errorHandler(error.message, 500));
      }
    }

    return res.status(200).json({
      success: true,
      user: user,
    });
  }
);

// exports.socialAuth = catchAsyncErron(async (req, res, next) => {
//   try {
//     const { email, name, avatar } = req.body;
//     const user = await User.findOne({ email: email });

//     if (!user) {
//       const newuser = await User.create({ email, name, avatar });
//       const { accesToken, refreshToken } = generateTokens(newuser);
//       const options = {
//         httpOnly: true,
//         secure: true,
//       };
//       res
//         .status(200)
//         .cookie("accesToken", accesToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json({
//           succcess: true,
//           message: "successfully login",
//           user: newuser,
//           accesToken: accesToken,
//           refreshToken: refreshToken,
//         });
//     } else {
//       const { accesToken, refreshToken } = generateTokens(user);
//       const options = {
//         httpOnly: true,
//         secure: true,
//       };
//       res
//         .status(200)
//         .cookie("accesToken", accesToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json({
//           succcess: true,
//           message: "successfully login",
//           user: user,
//           accesToken: accesToken,
//           refreshToken: refreshToken,
//         });
//     }
//   } catch (error) {
//     return next(new errorHandler(error.message, 400));
//   }
// });

interface IUpdataUser {
  email?: string;
  name?: string;
  contact?: string;
}

// UPDATE USER INFORMATION LIKE EMAIL, CONTACT, NAME
export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, contact } = req.body as IUpdataUser;
    const userId = req.params?.id;

    try {
      // Find user by ID
      const user: IUser | null = await User.findById(userId);

      // If user not found, return an error
      if (!user) return next(new errorHandler("User not found", 404));

      // If email is provided, check for email uniqueness
      if (email !== undefined && email !== null && email !== "") {
        const isEmailExit = await User.findOne({ email: email });
        if (isEmailExit) {
          return next(
            new errorHandler("User with this email address already exists", 400)
          );
        }
        user.email = email;
      }

      // Update name if provided
      if (name !== undefined && name !== null && name !== "") {
        user.name = name;
      }

      // Update contact if provided
      if (contact !== undefined && contact !== null && contact !== "") {
        user.contact = contact;
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user);

      // Update refresh token in user model and save to Redis
      user.refreshToken = refreshToken;
      await user.save();
      await redis.set(user._id, JSON.stringify(user));

      // Set cookies for tokens
      const options = {
        httpOnly: true,
        secure: true,
      };

      // Send success response
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          success: true,
          message: "User information updated successfully",
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
    } catch (error: any) {
      // If an error occurs during database query or token generation, pass it to the error handler middleware
      return next(new errorHandler(error.message, 500));
    }
  }
);

interface IUpdatePassword {
  password: string;
  oldPassword: string;
}

export const updateUserPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, oldPassword } = req.body as IUpdatePassword;

    // Check if both old and new passwords are provided
    if (!password || !oldPassword) {
      return next(new errorHandler("Missing password", 400));
    }

    try {
      // Find user by ID and select password field
      const user = await User.findById(req.params.id).select("+password");

      // If user not found, return error
      if (!user) {
        return next(new errorHandler("User not found", 404));
      }

      // Compare old password with stored password
      const isPasswordMatch = await user.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new errorHandler("Wrong credentials", 401));
      }

      // Update password
      user.password = password;
      await user.save();
      await redis.set(user._id, JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

// exports.userAvatar = catchAsyncErron(async (req, res, next) => {
//   const avatar = req.body.avater;
//   const userId = req.user._id;
//   const user = await User.findById(userId);

//   if (user.avatar.public_id) {
//     await cloudinary.v2.uploader.destroy(user.avatar.public_id);
//   }
//   const myavatar = await cloudinary.v2.uploader.upload(avatar, {
//     folder: "avaters",
//   });
//   user.avatar.public_id = myavatar.public_id;
//   user.avatar.url = myavatar.secure_url;
//   await user.save();
//   await redis.set(user._id, JSON.stringify(user));
//   res.status(200).json({
//     succcess: true,
//     message: "successfully upload Avatar`",
//     user: user,
//   });
// });

// // add Query in Course Contant
// exports.addQueston = catchAsyncErron(async (req, res, next) => {
//   const { question, courseId, contantId } = req.body;
//   const userCourseList = req.user?.courses;

//   // check user has purchis the course
//   const courseAccess = userCourseList.find(
//     (course) => course.courseId.toString() === courseId
//   );

//   if (!courseAccess) {
//     return next(
//       new errorHandler("You are not eligible to ask questin on is course", 404)
//     );
//   }

interface IAddQuestion {
  question: string;
  courseId: string;
  contentId: string;
}

// Route to add a question in course content
export const addQuestion = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { question, courseId, contentId } = req.body as IAddQuestion;
    let user: string | null = await redis.get(id);
    let newUser: object = {};
    if (user) {
      newUser = JSON.parse(user);
    }
    const userCourseList = (newUser as IUser)?.courses; // Assuming req.user is of type IUser

    // Check if the user has purchased the course
    const courseAccess = userCourseList.find(
      (course) => course.courseId.toString() === courseId
    );

    if (!courseAccess) {
      return next(
        new errorHandler(
          "You are not eligible to ask questions in this course",
          404
        )
      );
    }

    const courseData = await CourseData.findById(contentId);

    if (!courseData || courseData.course.toString() !== courseId) {
      return next(new errorHandler("Invalid Content ID", 404));
    }

    // const query = await Query.create({
    //   user: newUser._id,
    //   query: question,
    //   courseData: contantId,
    // });

    // res.status(200).json({
    //   succcess: true,
    //   message: "Query Add",
    //   query,
    // });

    // Your remaining logic goes here
  }
);

//   // check course in cache
//   const isCourseExist = await redis.get(courseId);

//   if (!isCourseExist) {
//     const courseInDB = await Course.findById(courseId);
//     if (!courseInDB) {
//       return next(new errorHandler("Invalid Course ID", 404));
//     }
//     await redis.set(courseInDB._id, JSON.stringify(courseInDB));
//     if (courseId != courseInDB._id) {
//       return next(new errorHandler("Invalid Course ID", 404));
//     }
//   }
//   const course = await JSON.parse(isCourseExist);
//   if (course._id != courseId) {
//     return next(new errorHandler("Invalid Course ID", 404));
//   }

//   const courseData = CourseData.findById(contantId);

//   if (courseData.course != courseId) {
//     return next(new errorHandler("Invalid Contact ID", 404));
//   }

//   const query = await Query.create({
//     user: req.user.id,
//     query: question,
//     courseData: contantId,
//   });

//   res.status(200).json({
//     succcess: true,
//     message: "Query Add",
//     query,
//   });
// });

// // add Review in Course
// exports.addQueston = catchAsyncErron(async (req, res, next) => {
//   const { rating, review, courseId } = req.body;
//   const user = req.user;

//   // check user has purchis the course
//   const courseAccess = user.courseData.find(
//     (course) => course.courseId.toString() === courseId
//   );

//   if (!courseAccess) {
//     return next(
//       new errorHandler("Not Authenticated to add Review on Course", 404)
//     );
//   }

//   const courseInDB = await Course.findById(courseId);
//   if (!courseInDB) {
//     return next(new errorHandler("Invalid Course ID", 404));
//   }
//   await redis.set(courseInDB._id, JSON.stringify(courseInDB));
//   const newreview = await Review.create({
//     rating: parseInt(rating),
//     review: review,
//     user: user._id,
//     course: courseId,
//   });
//   res.status(200).json({
//     newreview,
//   });
// });

// // Change User Role    ----only admin
// exports.changeUserRole = catchAsyncErron(async (req, res, next) => {
//     const userId = req.params.id;

//     const user = await User.findById(userId);
//     user.role = "admin";
//     await user.save();
//     res.status(200).json({
//         succcess: true,
//         message: "Deleted User",
//     });
// });

// // Delet user    ---- only admin
// exports.deletUser = catchAsyncErron(async (req, res, next) => {
//     const userId = req.params.id;

//     const user = await User.findOneAndDelete({_id:userId});

//     if(!user){
//         return next(new errorHandler("user not found",404));
//     }

//     await redis.del(user._id);

//     res.status(200).json({
//         succcess: true,
//         message: "Deleted User",
//     });
// });
