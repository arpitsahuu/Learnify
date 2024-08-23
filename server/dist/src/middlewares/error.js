"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new errorHandler_1.default(message, 400);
    }
    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new errorHandler_1.default(message, 400);
    }
    // wrong jwt error 
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again`;
        err = new errorHandler_1.default(message, 400);
    }
    // Jwt expire error 
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is Expired, try again`;
        err = new errorHandler_1.default(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errName: err.name,
    });
};
exports.ErrorMiddleware = ErrorMiddleware;
