"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.addQuestion = exports.updateAvatar = exports.updateUserPassword = exports.updateUserInfo = exports.getUserInfo = exports.updateAccessToken = exports.resentEmail = exports.userLongOut = exports.userLogin = exports.userActivation = exports.userRegistration = exports.homepage = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const sendmail_1 = __importDefault(require("../utils/sendmail"));
const activationToken_1 = require("../utils/activationToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens_1 = require("../utils/generateTokens");
const redis_1 = require("../models/redis");
const courseData_1 = __importDefault(require("../models/coureModels/courseData"));
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: "dcj2gzytt",
    api_key: process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
exports.homepage = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => { });
// SEND ACTIVATION CODE AND TOKEN TO VERIFY USER EMAIL
exports.userRegistration = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const requestBody: IRegistrationBody = req.body as IRegistrationBody ;
    console.log(req.body);
    const { name, email, password, contact } = req.body;
    // if (!name || !email || !password || !contact)
    //   return next(new errorHandler(`fill all deatils`));
    const isEmailExit = yield userModel_1.default.findOne({ email: email });
    if (isEmailExit)
        return next(new errorHandler_1.default("User With This Email Address Already Exits"));
    const ActivationCode = Math.floor(1000 + Math.random() * 9000);
    const user = {
        name,
        email,
        password,
    };
    if (contact) {
        user.contact = contact;
    }
    console.log("enter");
    const data = { name: name, activationCode: ActivationCode };
    try {
        yield (0, sendmail_1.default)(next, email, "Verification code", "activationMail.ejs", data);
        console.log("extracted");
        let token = yield (0, activationToken_1.activationToken)(user, ActivationCode);
        let options = {
            httpOnly: true,
            secure: true,
        };
        res.status(200).cookie("token", token, options).json({
            succcess: true,
            message: "successfully send mail pleas check your Mail",
            token,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
// REGISTER USER AFTER MAIL VERIFICATION .
exports.userActivation = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { activationCode, activation_token } = req.body;
    console.log(req.body);
    if (!activationCode)
        return next(new errorHandler_1.default("Provide Activation Code"));
    let { token } = req.cookies;
    if (!token) {
        token = activation_token;
    }
    let tokenInof = (yield jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET));
    console.log(tokenInof);
    const isEmailExit = yield userModel_1.default.findOne({ email: tokenInof.user.email });
    if (isEmailExit)
        return next(new errorHandler_1.default("User With This Email Address Already Exits"));
    console.log(isEmailExit);
    if (activationCode != (tokenInof === null || tokenInof === void 0 ? void 0 : tokenInof.ActivationCode))
        return next(new errorHandler_1.default("Wrong Activation Code"));
    let { name, email, password } = tokenInof.user;
    const newUser = yield userModel_1.default.create({
        name,
        email,
        password,
        isVerified: true,
    });
    console.log(newUser);
    const tokens = (0, generateTokens_1.generateTokens)(newUser);
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    };
    res
        .status(201)
        .cookie("accessToken", tokens === null || tokens === void 0 ? void 0 : tokens.accessToken, options)
        .cookie("refreshToken", tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken, options)
        .json({
        succcess: true,
        message: "successfully register",
        user: newUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken,
    });
}));
// LOGIN USER WIHT EMAIL AND PASSWORD
exports.userLogin = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new errorHandler_1.default("Pleas fill all details"));
    // const user: IUser | null = await User.findOne({ email: email }).populate("cou").select("+password -courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
    const user = yield userModel_1.default.findOne({ email: email }).select("+password").populate("courses").exec();
    if (!user)
        return next(new errorHandler_1.default("User Not Found With this Email", 401));
    const isMatch = yield user.comparePassword(password);
    if (!isMatch)
        return next(new errorHandler_1.default("Wrong Credientials", 401));
    const tokens = (0, generateTokens_1.generateTokens)(user);
    user.refreshToken = tokens.refreshToken;
    yield user.save();
    user.password = "";
    yield redis_1.redis.set(user._id, JSON.stringify(user));
    const options = {
        httpOnly: true,
        secure: true,
    };
    res
        .status(200)
        .cookie("accessToken", tokens === null || tokens === void 0 ? void 0 : tokens.accessToken, options)
        .cookie("refreshToken", tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken, options)
        .json({
        succcess: true,
        message: "successfully login",
        user: user,
        accesToken: tokens === null || tokens === void 0 ? void 0 : tokens.accessToken,
        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.accessToken,
    });
}));
// LOGOUT USER
exports.userLongOut = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    console.log(id);
    if (!id)
        return next(new errorHandler_1.default("login to user the resorse", 404));
    yield userModel_1.default.findByIdAndUpdate(id, {
        $set: {
            refreshToken: undefined,
        },
    });
    yield redis_1.redis.del(id);
    const options = {
        httpOnly: true,
        secure: true,
    };
    res.clearCookie("accesToken", options)
        .clearCookie("refreshToken", options)
        .json({
        succcess: true,
        message: "successfully logout",
    });
}));
exports.resentEmail = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let { token } = req.cookies;
    let tokenInof = (yield jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET));
    const data = { name: tokenInof.user.name, activationCode: tokenInof.ActivationCode };
    try {
        yield (0, sendmail_1.default)(next, (_a = tokenInof === null || tokenInof === void 0 ? void 0 : tokenInof.user) === null || _a === void 0 ? void 0 : _a.email, "Verification code", "activationMail.ejs", data);
        res.status(200).json({
            succcess: true,
            message: `send email to ${(_b = tokenInof === null || tokenInof === void 0 ? void 0 : tokenInof.user) === null || _b === void 0 ? void 0 : _b.email}`,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
exports.updateAccessToken = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;
        if (!incomingRefreshToken) {
            return next(new errorHandler_1.default("unathorized request", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return next(new errorHandler_1.default("Invalid Refresh Token", 401));
        }
        const user = yield userModel_1.default.findById(decoded._id);
        if (!user) {
            return next(new errorHandler_1.default("Invalid Refresh Token", 401));
        }
        if ((user === null || user === void 0 ? void 0 : user.refreshToken) !== incomingRefreshToken) {
            return next(new errorHandler_1.default("Refresh Token is expired or used", 401));
        }
        const tokens = (0, generateTokens_1.generateTokens)(user);
        user.refreshToken = tokens.refreshToken;
        yield user.save();
        user.password = "";
        yield redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days
        const options = {
            httpOnly: true,
            secure: true,
        };
        res
            .status(200)
            .cookie("accessToken", tokens === null || tokens === void 0 ? void 0 : tokens.accessToken, options)
            .cookie("refreshToken", tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken, options)
            .json({
            succcess: true,
            message: "Update AccessToken",
            accesToken: tokens === null || tokens === void 0 ? void 0 : tokens.accessToken,
            refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.accessToken,
        });
        return next();
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 401));
    }
}));
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
exports.getUserInfo = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        const user = req.user;
        if (!user) {
            next(new errorHandler_1.default("user not lonin", 401));
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// UPDATE USER INFORMATION LIKE EMAIL, CONTACT, NAME
exports.updateUserInfo = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, name, contact } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    console.log(userId);
    try {
        // Find user by ID
        const user = yield userModel_1.default.findById(userId);
        // If user not found, return an error
        if (!user)
            return next(new errorHandler_1.default("User not found", 404));
        // If email is provided, check for email uniqueness
        if (email !== undefined && email !== null && email !== "" && email === user.email) {
            const isEmailExit = yield userModel_1.default.findOne({ email: email });
            if (isEmailExit) {
                return next(new errorHandler_1.default("User with this email address already exists", 400));
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
        const { accessToken, refreshToken } = (0, generateTokens_1.generateTokens)(user);
        // Update refresh token in user model and save to Redis
        user.refreshToken = refreshToken;
        yield user.save();
        yield redis_1.redis.set(user._id, JSON.stringify(user));
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
    }
    catch (error) {
        // If an error occurs during database query or token generation, pass it to the error handler middleware
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
exports.updateUserPassword = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, oldPassword } = req.body;
    // Check if both old and new passwords are provided
    if (!password || !oldPassword) {
        return next(new errorHandler_1.default("Missing password", 400));
    }
    try {
        // Find user by ID and select password field
        const user = yield userModel_1.default.findById(req.params.id).select("+password");
        // If user not found, return error
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        // Compare old password with stored password
        const isPasswordMatch = yield user.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return next(new errorHandler_1.default("Wrong credentials", 401));
        }
        // Update password
        user.password = password;
        yield user.save();
        yield redis_1.redis.set(user._id, JSON.stringify(user));
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
exports.updateAvatar = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { avatar } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield userModel_1.default.findById(userId).exec();
        if (!user) {
            next(new errorHandler_1.default("user not lonin", 401));
        }
        if (avatar && user) {
            // if user have one avatar then call this if
            if ((_b = user === null || user === void 0 ? void 0 : user.avatar) === null || _b === void 0 ? void 0 : _b.public_id) {
                // first delete the old image
                yield cloudinary_1.default.v2.uploader.destroy((_c = user === null || user === void 0 ? void 0 : user.avatar) === null || _c === void 0 ? void 0 : _c.public_id);
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            else {
                const myCloud = yield cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield redis_1.redis.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// Route to add a question in course content
exports.addQuestion = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { question, courseId, contentId } = req.body;
    let user = yield redis_1.redis.get(id);
    let newUser = {};
    if (user) {
        newUser = JSON.parse(user);
    }
    const userCourseList = newUser === null || newUser === void 0 ? void 0 : newUser.courses; // Assuming req.user is of type IUser
    // Check if the user has purchased the course
    const courseAccess = userCourseList.find((course) => course.courseId.toString() === courseId);
    if (!courseAccess) {
        return next(new errorHandler_1.default("You are not eligible to ask questions in this course", 404));
    }
    const courseData = yield courseData_1.default.findById(contentId);
    if (!courseData || courseData.course.toString() !== courseId) {
        return next(new errorHandler_1.default("Invalid Content ID", 404));
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
}));
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
// GET ALL USERS - FOR ADMIN ONLY
exports.getAllUsers = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// CHANGE USER ROLE - ONLY FOR ADMIN
exports.updateUserRole = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = req.body;
        const isUserExist = yield userModel_1.default.findOne({ email });
        if (isUserExist) {
            const id = isUserExist._id;
            const user = yield userModel_1.default.findByIdAndUpdate(id, { role }, { new: true });
            res.status(201).json({
                success: true,
                user,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// DELETE USER - ONLY FOR ADMIN
exports.deleteUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userModel_1.default.findById(id);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        yield user.deleteOne({ id });
        yield redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
