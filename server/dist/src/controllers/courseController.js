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
exports.searchCourses = exports.getAdminAllCourses = exports.getCourseByUser = exports.getAllCourses = exports.getSingleCourse = exports.deltetCours = exports.editCourse = exports.uploadCourse = exports.generateVideoUrl = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const axios_1 = __importDefault(require("axios"));
const courseModel_1 = __importDefault(require("../models/coureModels/courseModel"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const redis_1 = require("../models/redis");
const courseData_1 = __importDefault(require("../models/coureModels/courseData"));
cloudinary_1.default.v2.config({
    cloud_name: "dcj2gzytt",
    api_key: process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
// GENERATE THE VIDEOURL
exports.generateVideoUrl = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.body;
        const response = yield axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// CREATE NEW COURSE
exports.uploadCourse = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, description, price, categories, estimatedPrice, thumbnail, tags, level, demoUrl, benefits, prerequisites, reviews, rating, purchased, totalVideos, courseData, } = req.body;
        const data = req.body;
        console.log(data);
        const courseDataIds = [];
        if (courseData && courseData.length > 0) {
            for (const data of courseData) {
                const newCourseData = new courseData_1.default(data);
                const savedCourseData = yield newCourseData.save();
                courseDataIds.push(savedCourseData._id);
            }
        }
        const ismg = req.file;
        if (thumbnail) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        // Create a new course instance with the created CourseData ObjectIds
        const newCourse = new courseModel_1.default({
            name,
            description,
            price,
            categories,
            estimatedPrice,
            thumbnail,
            tags,
            level,
            demoUrl,
            benefits,
            prerequisites,
            reviews,
            rating,
            purchased,
            totalVideos,
            courseData: courseDataIds,
        });
        // Save the course to the database
        const savedCourse = yield newCourse.save();
        res.status(201).json({
            success: true,
            course: savedCourse,
        });
    }
    catch (error) {
        console.log(error);
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
//EDIT COURSE
exports.editCourse = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseId = req.params.id;
        const courseData = (yield courseModel_1.default.findById(courseId));
        if (thumbnail && !thumbnail.startsWith("https")) {
            yield cloudinary_1.default.v2.uploader.destroy(courseData.thumbnail.public_id);
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: courseData === null || courseData === void 0 ? void 0 : courseData.thumbnail.public_id,
                url: courseData === null || courseData === void 0 ? void 0 : courseData.thumbnail.url,
            };
        }
        const course = yield courseModel_1.default.findByIdAndUpdate(courseId, {
            $set: data,
        }, { new: true });
        yield redis_1.redis.set(courseId, JSON.stringify(course)); // update course in redis
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
//EDIT COURSE
exports.deltetCours = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const course = yield courseModel_1.default.findById(id);
        if (!course) {
            return next(new errorHandler_1.default("Indalid course ID", 401));
        }
        if (course === null || course === void 0 ? void 0 : course.thumbnail) {
            const thumbnail = course.thumbnail;
            yield cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id);
        }
        yield courseModel_1.default.findByIdAndDelete(id);
        res.status(201).json({
            success: true,
            message: "succesfully deleted",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
//Get Single Course
exports.getSingleCourse = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        console.log(courseId);
        const isCacheExist = yield redis_1.redis.get(courseId);
        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course,
            });
        }
        else {
            const course = yield courseModel_1.default.findById(req.params.id)
                .populate("courseData")
                .select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            yield redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days
            res.status(200).json({
                success: true,
                course,
            });
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
//Get All Courses
exports.getAllCourses = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield courseModel_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
//get course content -- only for valid user
exports.getCourseByUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userCourseList = (_a = req.user) === null || _a === void 0 ? void 0 : _a.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.find((course) => course._id.toString() === courseId);
        if (!courseExists) {
            return next(new errorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = yield courseModel_1.default.findById(courseId).populate("courseData");
        const content = course === null || course === void 0 ? void 0 : course.courseData;
        console.log(content);
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// get all courses --- only for admin
exports.getAdminAllCourses = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield courseModel_1.default.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
}));
//Search Courses
exports.searchCourses = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    function searchCourses(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRegex = new RegExp(query, "i"); // 'i' for case-insensitive
            const queryObj = {
                name: { $regex: searchRegex },
            };
            return courseModel_1.default.find(queryObj).select('name price thumbnail level categories');
        });
    }
    try {
        const searchQuery = req.query.q;
        if (!searchQuery) {
            return next(new errorHandler_1.default("Provide search Text", 401));
        }
        const courses = yield searchCourses(searchQuery);
        console.log(courses);
        res.status(201).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
