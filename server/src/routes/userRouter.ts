import express from 'express';
import { deleteUser, getAllUsers, getUserInfo, resentEmail, updateUserInfo, updateUserPassword, updateUserRole, userActivation, userLogin, userLongOut, userRegistration } from '../controllers/userController';
import { isAutheticated } from '../middlewares/auth';

const router = express.Router();

// USER REGISTRATION 
router.post("/registration",userRegistration);

// USER ACTIVATION CODE (for verify user email) 
router.post("/activate/user",userActivation);

// USER LONIN 
router.post("/login",userLogin);

// USER LONOUT 
router.get("/logout",userLongOut);

// Resend mail 
router.get("/resend/email",resentEmail);

// USER INFO 
router.get("/me",isAutheticated, getUserInfo);

// UPDATE USER INFO 
router.put("/me",updateUserInfo);

// UPDATE USER PASSWORD
router.patch("/password",updateUserPassword);

// USER INFO 
// router.post("/me",isAutheticated, userInfo); 

//GET ALL USERS INFO -ONLY FOR USER
router.get("/users",getAllUsers);  

// UPDATE USER ROLE -ONLY FOR ADMIN
router.put("/user/role",updateUserRole); 

// DELET USER -ONLY FOR ADMIN
router.delete("/user/:id",deleteUser); 

export default router;
