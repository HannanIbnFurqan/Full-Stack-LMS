import jwt from 'jsonwebtoken'
import AppError from '../utils/error.util.js'

const isLoggedIn = async (req,res,next) =>{
    const {token} = req.cookies
    if(!token){
       return next(new AppError('unAuthanticated'))
    }

    const userDetail = await jwt.verify(token, process.env.JWT_SECRET)

    req.user = userDetail

    next()
}

const authorizedRoles = (...roles)=> async (req,res,next) =>{
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)){
        return next(new AppError('you do not have permission to access this route'))
    }
    next();
}

export {
    isLoggedIn,
    authorizedRoles
}