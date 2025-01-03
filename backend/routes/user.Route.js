import express from 'express'
// auth middleware
import { isLoggedIn } from '../middleWare/auth.middleware.js';
const userRouter = express.Router();
// import user controller from controller
import {login, logout, 
        getUser, forgotPassword,
        register, resetPassword, 
        changePassword, updateUser} from '../controller/user.controller.js';
// multer middleWare
import upload from '../middleWare/multer.middleware.js';

// all userRouter
userRouter.post('/register',upload.single("avatar"), register)
userRouter.post('/login', login)
userRouter.get('/logout', logout)
userRouter.get('/getUser', isLoggedIn, getUser)
userRouter.post('/reset', forgotPassword)
userRouter.post('/reset/:resetToken', resetPassword)
userRouter.post('/change',login, changePassword)
userRouter.put('/update', login,upload.single("avatar"), updateUser)
export default userRouter