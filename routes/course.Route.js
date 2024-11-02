import express from 'express'
import {getAllCourses, getLecturesByCoureId, createCourse, updateCourse, removeCourse} from '../controller/course.controller.js'
import { authorizedRoles, isLoggedIn } from '../middleWare/auth.middleware.js';
import upload from '../middleWare/multer.middleware.js';
const courseRoute = express.Router();

courseRoute.route.get('/', getAllCourses)
 .post(
    isLoggedIn, 
    authorizedRoles('ADMIN'), 
    upload.single('thumbnail'),
    createCourse)

courseRoute.route.get('/:id', isLoggedIn, getLecturesByCoureId)
 .put(
    isLoggedIn,
     authorizedRoles('ADMIN'),
    updateCourse)
 .delete(
    isLoggedIn,
     authorizedRoles('ADMIN'),
    removeCourse
)
.post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single('lectures'),
    addLectureToCourseById
)


export default courseRoute