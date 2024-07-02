import express from "express";
import { getCoursesAnalytics, getOrderAnalytics, getUsersAnalytics } from "../controllers/analyticsController";

const analyticsRouter = express.Router();


analyticsRouter.get("/get-users-analytics", getUsersAnalytics);

analyticsRouter.get("/get-orders-analytics", getOrderAnalytics);

analyticsRouter.get("/get-courses-analytics", getCoursesAnalytics);


export default analyticsRouter;