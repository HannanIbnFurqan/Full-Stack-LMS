import express from 'express'
import {getAllCourses, getLecturesByCoureId} from '../controller/course.controller.js'
const courseRoute = express.Router();

courseRoute.get('/', getAllCourses)
courseRoute.get('/:id', getLecturesByCoureId)

export default courseRoute