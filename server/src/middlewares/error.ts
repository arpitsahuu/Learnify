import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/errorHandler";

export const ErrorMiddleware = (err:any,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";  
    
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid ${err.path}`
        err = new errorHandler(message,400);
    }

     // Duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new errorHandler(message,400);
    }
    
    // wrong jwt error 
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid, try again`;
        err = new errorHandler(message,400);
    }

    // Jwt expire error 
    if(err.name === "TokenExpiredError"){
        const message = `Json web token is Expired, try again`;
        err = new errorHandler(message,400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errName: err.name,
    })
}