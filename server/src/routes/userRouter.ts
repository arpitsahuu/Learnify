import express from 'express';
import { userRegistration } from '../controllers/userController';

const router = express.Router();

// USER REGISTRATION 
router.post("/registration",userRegistration);

export default router;
