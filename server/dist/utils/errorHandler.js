"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class errorHandler extends Error {
    constructor(message, statusCode = 404) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = errorHandler;
