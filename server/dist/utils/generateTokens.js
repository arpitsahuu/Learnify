"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const redis_1 = require("../models/redis");
const generateTokens = (user) => {
    const accessToken = user.generateAccesToken();
    const refreshToken = user.generateRefreashToken();
    //upload session to redis
    redis_1.redis.set(user._id, JSON.stringify(user));
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
