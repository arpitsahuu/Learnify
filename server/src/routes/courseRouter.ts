import express from 'express';
import { generateVideoUrl, uploadCourse } from '../controllers/courseController';
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




export default courseRouter;
