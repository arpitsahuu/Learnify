import express from 'express';
import { updateUserInfo, updateUserPassword, userActivation, userLogin, userLongOut, userRegistration } from '../controllers/userController';
import { userInfo } from 'os';

const router = express.Router();

// USER REGISTRATION 
router.post("/registration",userRegistration);

// USER ACTIVATION CODE (for verify user email) 
router.post("/activate/user",userActivation);

// USER LONIN 
router.post("/login",userLogin);

// USER LONOUT 
router.get("/logout",userLongOut);

// USER INFO 
router.get("/me",userInfo);

// UPDATE USER INFO 
router.put("/me",updateUserInfo);

// UPDATE USER PASSWORD
router.patch("/password",updateUserPassword);

// USER INFO 
router.post("/me",userInfo);    

export default router;
