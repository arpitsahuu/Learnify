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
exports.paymentVerification = exports.getRozorpaykey = exports.checkout = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const razorpayConfig_1 = require("../utils/razorpayConfig");
const courseModel_1 = __importDefault(require("../models/coureModels/courseModel"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../models/userModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const sendmail_1 = __importDefault(require("../utils/sendmail"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("../models/redis");
dotenv_1.default.config();
// CREATET ORDER
exports.checkout = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { id } = req.body;
        console.log(id);
        // const user = req.user;
        const course = yield courseModel_1.default.findById(id);
        if (!course) {
            return next(new errorHandler_1.default("Wrong Course ID", 400));
        }
        // const reqamout = course?.price;
        let options = {
            amount: (course === null || course === void 0 ? void 0 : course.price) * 100,
            currency: "INR",
        };
        const order = yield razorpayConfig_1.instance.orders.create(options);
        console.log(order);
        res.json({
            order,
            courseID: course._id,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// GET ROZORPAYKEY API KEY
exports.getRozorpaykey = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        key: process.env.RAZORPAY_API_KEY,
    });
}));
// VERIFY THE PAYMENT
exports.paymentVerification = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req.body);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
        let courseId = req.params.id;
        console.log(courseId);
        console.log('RAZORPAY_API_SECRA:', process.env.RAZORPAY_API_SECRAT);
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        console.log(body);
        const expectedSignature = yield crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_API_SECRAT)
            .update(body.toString())
            .digest("hex");
        console.log(expectedSignature);
        const isAuthentic = expectedSignature === razorpay_signature;
        console.log(isAuthentic);
        if (!isAuthentic) {
            return next(new errorHandler_1.default("Payment not authorized!", 400));
        }
        const course = yield courseModel_1.default.findById(courseId);
        if (isAuthentic && course) {
            const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            user === null || user === void 0 ? void 0 : user.courses.push(course._id);
            console.log(user);
            yield (user === null || user === void 0 ? void 0 : user.save());
            const updateuser = yield userModel_1.default.findById(user === null || user === void 0 ? void 0 : user._id).populate("courses").exec();
            yield redis_1.redis.set(user === null || user === void 0 ? void 0 : user._id, JSON.stringify(updateuser));
            const order = yield orderModel_1.default.create({
                user: user === null || user === void 0 ? void 0 : user._id,
                course: courseId,
                paymentInfo: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                },
            });
            console.log(order);
            const maildata = {
                name: course.name,
                orde_id: order._id,
                course: course.price,
                order: {
                    name: course.name,
                    orde_id: order._id,
                    price: course.price,
                }
            };
            console.log("mail");
            //SEND MEAI FOR SUCCESSFULL COURSE PURCHASE 
            try {
                if (req === null || req === void 0 ? void 0 : req.user) {
                    yield (0, sendmail_1.default)(next, user === null || user === void 0 ? void 0 : user.email, "Verification code", "order-confirmation.ejs", maildata);
                }
            }
            catch (error) {
                return next(new errorHandler_1.default(error.message, 500));
            }
            console.log("send mail");
            yield notificationModel_1.default.create({
                title: "New Order",
                message: `You have a new order from ${course === null || course === void 0 ? void 0 : course.name}`,
                user: user === null || user === void 0 ? void 0 : user._id
            });
            console.log("noteficarion");
            if (course) {
                course.purchased = (course === null || course === void 0 ? void 0 : course.purchased) + 1;
                yield course.save();
            }
            res.status(200).json({
                success: true,
                order,
                updateuser
            });
        }
        else {
            res.status(400).json({
                success: false,
            });
        }
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
