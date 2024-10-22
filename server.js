import express from 'express'
import cookieParser from 'cookie-parser'
import errorMiddleware from './middleWare/error.middleware.js';
import userRoutes from './routes/user.Route.js'
import connectDB from './config/dbConnection.js';
import dotenv from 'dotenv'
const app = express()
dotenv.config()
// middleWare 
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 5000

// user route
app.use('/api/v1/user', userRoutes);

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 page not found');
})

app.use(errorMiddleware);

app.listen(PORT, ()=>{
    console.log('server is running')
    connectDB()
})