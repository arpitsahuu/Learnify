"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyticsController_1 = require("../controllers/analyticsController");
const analyticsRouter = express_1.default.Router();
analyticsRouter.get("/get-users-analytics", analyticsController_1.getUsersAnalytics);
analyticsRouter.get("/get-orders-analytics", analyticsController_1.getOrderAnalytics);
analyticsRouter.get("/get-courses-analytics", analyticsController_1.getCoursesAnalytics);
exports.default = analyticsRouter;
