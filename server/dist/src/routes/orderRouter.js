"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middlewares/auth");
const orderRouter = express_1.default.Router();
// GET RAZORPAY API KEY
orderRouter.get("/getkey", auth_1.isAutheticated, orderController_1.getRozorpaykey);
// CHECKOUT
orderRouter.post("/checkout", auth_1.isAutheticated, orderController_1.checkout);
//  VERIFY PAYMENT
orderRouter.post("/paymentVerification/:id", auth_1.isAutheticated, orderController_1.paymentVerification);
exports.default = orderRouter;
