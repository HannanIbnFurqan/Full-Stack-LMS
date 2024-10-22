import express from 'express'
// auth middleware
import { isLoggedIn } from '../middleWare/auth.middleware.js';
const userRouter = express.Router();
// import user controller from controller
import { register } from '../controller/user.controller.js';
import { login } from '../controller/user.controller.js';
import { logout } from '../controller/user.controller.js';
import { getUser } from '../controller/user.controller.js';

// all userRouter
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/logout', logout)
userRouter.get('/getUser', isLoggedIn, getUser)

export default userRouter