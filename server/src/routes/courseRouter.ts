import express from 'express';
import { generateVideoUrl, getAdminAllCourses, getAllCourses, getSingleCourse, uploadCourse } from '../controllers/courseController';
import {  isAutheticated } from '../middlewares/auth';
import {upload} from "../middlewares/multer"



const courseRouter = express.Router();

// USER REGISTRATION 
courseRouter.post("/getVdoCipherOTP",generateVideoUrl);

courseRouter.post(
    "/create-course",
    isAutheticated,
    uploadCourse
); 

courseRouter.post("/che", uploadCourse)

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get(
    "/get-admin-courses",
    // isAutheticated,
    // authorizeRoles("admin"),
    getAdminAllCourses
);




export default courseRouter;
