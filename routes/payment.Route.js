import express from 'express'
import {getRazorpayApiKey, buySubscription,
       verifySubscription, cancelSubscription, 
       allPayments} from '../controller/payment.controller.js'
import { authorizedRoles, isLoggedIn } from '../middleWare/auth.middleware.js';

const paymentRouter = express.Router();

paymentRouter.route('/razorpay-key')
     .get(isLoggedIn, getRazorpayApiKey)

paymentRouter.route('/subscribe')
      .post(isLoggedIn,buySubscription)

paymentRouter.route('/verify')
      .post(isLoggedIn,verifySubscription)

paymentRouter.route('/unsubscribe')
      .post(isLoggedIn,cancelSubscription)
paymentRouter.route('/')
      .get(isLoggedIn,authorizedRoles,allPayments)

export default paymentRouter