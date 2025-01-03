// import subscriptions from 'razorpay/dist/types/subscriptions.js';
import  User from '../model/user.Model.js'
import { razorpay } from '../server.js';
import AppError from '../utils/error.util.js';
import Payment from '../model/payment.model.js';

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
const verifySubscription = async (req,res)=>{
    const {id} = req.user;
    const {razorpay_payment_id , razorpay_signature, razorpay_subscription_id} = req.body;

    const user = await User.findById(id);
    if(!user){
        return next(new AppError('Unauthorized, please login'))
    }

    const generatedSignature = crypto
         .createHmac('sha256', process.env.RAZORPAY_SECRET)
         .update(`${razorpay_payment_id}|${buySubscription}`)
         .digest('hex');

         if(generatedSignature !== razorpay_signature){
            return next(new AppError('payment not verified, please try login',500))
         }

         await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
         })
    user.subscription.status = 'active';
    await user.save();

    res.status(200).json({
        success:true,
        message: 'Payment verified successfully'
    })
}
const cancelSubscription = async (req,res)=>{
   try {
    const {id} = req.user
    const user = await user.findById(id)
    if(!user){
        return next(new AppError('Unauthorized, please login'))
     }
     if(user.role === 'ADMIN'){
      return next(new AppError('Admin cannot purchase a subscription', 400))
  
     }

     const subscriptionId = user.subscription.id;
     const subscription = await razorpay.subscriptions.cancel(subscriptionId)
     user.subscription.status = subscription.status;

     await user.save();
   } catch (error) {
     return next(new AppError(e.message, 500))
   }
}
const allPayments = async (req,res)=>{
    const {count} = req.query;

    const subscriptions = await razorpay.subscriptions.all({
        count: count || 10,
    });

    res.status(200).json({
        success:true,
        message:'All Payments',
        subscriptions
    })

}

export {getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, allPayments}