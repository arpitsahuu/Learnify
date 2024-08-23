"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloud = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.cloud = cloudinary_1.default.v2.config({
    cloud_name: "dcj2gzytt",
    api_key: process.env.CLOUDINARY_PUBLIC_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
