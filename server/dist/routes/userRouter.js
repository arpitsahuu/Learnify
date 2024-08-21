"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// USER REGISTRATION 
router.post("/registration", userController_1.userRegistration);
// USER ACTIVATION CODE (for verify user email) 
router.post("/activate/user", userController_1.userActivation);
// USER LONIN 
router.post("/login", userController_1.userLogin);
// USER LONOUT 
router.get("/logout", auth_1.isAutheticated, userController_1.userLongOut);
// Resend mail 
router.get("/resend/email", userController_1.resentEmail);
// USER INFO 
router.get("/me", auth_1.isAutheticated, userController_1.getUserInfo);
// UPDATE USER INFO 
router.put("/update", auth_1.isAutheticated, userController_1.updateUserInfo);
// UPDATE USER PASSWORD
router.patch("/password", auth_1.isAutheticated, userController_1.updateUserPassword);
// UPDATE USER INFO 
router.post("/avatar", auth_1.isAutheticated, userController_1.updateAvatar);
// USER INFO 
// router.post("/me",isAutheticated, userInfo); 
//GET ALL USERS INFO -ONLY FOR USER
router.get("/users", userController_1.getAllUsers);
// UPDATE USER ROLE -ONLY FOR ADMIN
router.put("/user/role", userController_1.updateUserRole);
// DELET USER -ONLY FOR ADMIN
router.delete("/user/:id", userController_1.deleteUser);
//GET ALL USERS COURSES
router.get("/users", userController_1.getAllUsers);
exports.default = router;
