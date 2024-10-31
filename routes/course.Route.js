import express from 'express'
import {getAllCourses, getLecturesByCoureId, createCourse, updateCourse, removeCourse} from '../controller/course.controller.js'
import { isLoggedIn } from '../middleWare/auth.middleware.js';
import upload from '../middleWare/multer.middleware.js';
const courseRoute = express.Router();

courseRoute.get('/', getAllCourses)
courseRoute.post("/", upload.single('thumbnail'),createCourse)

courseRoute.get('/:id', isLoggedIn, getLecturesByCoureId)
courseRoute.put('/:id', updateCourse)
courseRoute.delete('/:id', removeCourse)

export default courseRoute