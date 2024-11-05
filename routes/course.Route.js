import express from 'express'
import {getAllCourses, getLecturesByCoureId, createCourse, updateCourse, removeCourse, addLectureToCourseById} from '../controller/course.controller.js'
import { authorizedRoles, isLoggedIn } from '../middleWare/auth.middleware.js';
import upload from '../middleWare/multer.middleware.js';
const courseRoute = express.Router();

courseRoute.get('/', getAllCourses)
courseRoute.post('/createCourse',isLoggedIn, authorizedRoles('ADMIN'), upload.single('thumbnail'),createCourse)

courseRoute.get('/:id', isLoggedIn, getLecturesByCoureId)
courseRoute.put('/updateCourse',isLoggedIn,authorizedRoles('ADMIN'),updateCourse)
courseRoute.delete('/removeCourse',isLoggedIn,authorizedRoles('ADMIN'),removeCourse)
courseRoute.post('/addLectureToCourseById',isLoggedIn,authorizedRoles('ADMIN'), upload.single('lectures'), addLectureToCourseById)


export default courseRoute