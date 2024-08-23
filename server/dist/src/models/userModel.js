"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "First name is required"],
        minLenght: [3, "Name should be atleast 3 character long"],
    },
    email: {
        type: String,
        unique: true,
        require: [true, "Email is required"],
    },
    contact: {
        type: String,
        minLenght: [10, "Contact should be atleast 10 character long"],
        maxLenght: [10, "Contact must not exceed 10 character"],
    },
    avatar: {
        type: Object,
        default: {
            public_id: "",
            url: "https://plus.unsplash.com/premium_photo-1683584405772-ae58712b4172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        },
    },
    gender: {
        type: String,
        emum: ["Male", "Female", "Others"],
    },
    password: {
        type: String,
        select: false,
    },
    courses: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    refreshToken: {
        type: String,
        default: "0",
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        emum: ["user", "admin"],
        default: "user",
    },
    // payments:[{
    //     courseID:String,
    //     paymentID:String,
    //     paymentTime:String,
    //     paymentDate:Date,
    // }]
}, { timestamps: true });
userModel.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
        next();
    });
});
userModel.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        let match = yield bcryptjs_1.default.compare(password, this.password);
        return match;
    });
};
userModel.methods.generateAccesToken = function () {
    const token = process.env.ACCESS_TOKEN_SECRET || "";
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
    }, token, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};
userModel.methods.generateRefreashToken = function () {
    const token = process.env.REFRESH_TOKEN_SECRET || "";
    return jsonwebtoken_1.default.sign({
        _id: this._id,
    }, token, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};
const User = mongoose_1.default.model("user", userModel);
exports.default = User;
