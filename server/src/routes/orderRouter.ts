import express from 'express';

import { checkout, getRozorpaykey, paymentVerification,} from '../controllers/orderController';
import { isAutheticated } from '../middlewares/auth';

const orderRouter = express.Router();

// GET RAZORPAY API KEY
orderRouter.get("/getkey",isAutheticated, getRozorpaykey);

// CHECKOUT
orderRouter.post("/checkout",isAutheticated, checkout);

//  VERIFY PAYMENT
orderRouter.post("/paymentVerification/:id",isAutheticated, paymentVerification);


export default orderRouter;