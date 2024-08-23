"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activationToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const activationToken = (user, ActivationCode) => {
    const tokenKey = process.env.REFRESH_TOKEN_SECRET || "";
    const token = jsonwebtoken_1.default.sign({
        user,
        ActivationCode
    }, tokenKey, {
        expiresIn: "5m"
    });
    return token;
};
exports.activationToken = activationToken;
