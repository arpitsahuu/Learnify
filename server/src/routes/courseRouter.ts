import express from 'express';
import { deltetCours, generateVideoUrl, getAdminAllCourses, getAllCourses, getSingleCourse, uploadCourse } from '../controllers/courseController';
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

courseRouter.post("/course", uploadCourse)

courseRouter.put("/course/:id", uploadCourse)

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get(
    "/get/admin/courses",
    // isAutheticated,
    // authorizeRoles("admin"),
    getAdminAllCourses
);

courseRouter.delete(
    "/course/:id",
    // isAutheticated,
    // authorizeRoles("admin"),
    deltetCours
);




export default courseRouter;
