"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = void 0;
const setCookie = (res, name, value, options) => {
    res.cookie(name, value, options);
};
exports.setCookie = setCookie;
