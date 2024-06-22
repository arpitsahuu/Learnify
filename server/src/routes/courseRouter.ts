import express from 'express';
import { generateVideoUrl } from '../controllers/courseController';


const courseRouter = express.Router();

// USER REGISTRATION 
courseRouter.post("/getVdoCipherOTP",generateVideoUrl);

    

export default courseRouter;
