"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* imports */
require("dotenv").config({ path: "./.env" });
const express_1 = __importDefault(require("express"));
const dbConnection_1 = __importDefault(require("./src/models/dbConnection"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./src/middlewares/error");
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = (0, express_1.default)();
/* middleware */
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
(0, dbConnection_1.default)();
// api request limit
const express_rate_limit_1 = require("express-rate-limit");
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(limiter);
const morgan_1 = __importDefault(require("morgan"));
app.use((0, morgan_1.default)("dev"));
// CORS setup
const allowedOrigins = [
    'https://learnify-weld-three.vercel.app', "https://learnify-c8oz9jn8r-arpits-projects-1c6b9bf9.vercel.app",
    "http://localhost:3000"
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    // optionsSuccessStatus: 200 ,// Address potential preflight request issues
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-Auth-Token'
    ], // Specify the allowed headers for the CORS request
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
/* router */
const userRouter_1 = __importDefault(require("./src/routes/userRouter"));
const courseRouter_1 = __importDefault(require("./src/routes/courseRouter"));
const layoutRouter_1 = __importDefault(require("./src/routes/layoutRouter"));
const analyticsRouter_1 = __importDefault(require("./src/routes/analyticsRouter"));
const orderRouter_1 = __importDefault(require("./src/routes/orderRouter"));
app.get("/", (req, res) => {
    res.json({ greed: "welcome to lernify" });
});
// app.use("/api/items", itemsRoutes);
app.use("/api/v1", userRouter_1.default, courseRouter_1.default, layoutRouter_1.default, analyticsRouter_1.default, orderRouter_1.default);
/* 404 */
app.all("*", (req, res, next) => {
    const err = new Error(`Router ${req.originalUrl} not forund `);
    err.statusCode = 404;
    next(err);
});
/* error Handling */
app.use(error_1.ErrorMiddleware);
/* server */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
