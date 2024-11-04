import  User from '../model/user.Model.js'
import { razorpay } from '../server.js';
import AppError from '../utils/error.util';

const getRazorpayApiKey = (req,res,next)=>{
    res.status(200).json({
        success:true,
        message:'Razarpay API Key',
        key: process.env.RAZORPAY_KEY_ID
    })
}
const buySubscription = async (req,res,next)=>{
   const {id} = req.user;
   const user = await User.findById(id);

   if(!user){
      return next(new AppError('Unauthorized, please login'))
   }
   if(user.role === 'ADMIN'){
    return next(new AppError('Admin cannot purchase a subscription', 400))

   }

   const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_notify: 1
   });

   user.subscription.id = subscription.id;
   user.subscription.status = subscription.status;

   await user.save()
}
const verifySubscription = (req,res)=>{

}
const cancelSubscription = (req,res)=>{

}
const allPayments = (req,res)=>{

}

export {getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, allPayments}