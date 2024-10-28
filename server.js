import express from 'express'
import cookieParser from 'cookie-parser'
import  urlencoded  from 'express';
import errorMiddleware from './middleWare/error.middleware.js';
import userRoutes from './routes/user.Route.js'
import connectDB from './config/dbConnection.js';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors'
import cloudinary from 'cloudinary'
const app = express()
dotenv.config()
// middleWare 
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000

// user route
app.use('/api/v1/user', userRoutes);
// cloudinary Configuration
cloudinary.v2.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret // Click 'View API Keys' above to copy your API secret
});

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 page not found');
})

app.use(errorMiddleware);

app.listen(PORT, ()=>{
    console.log('server is running',PORT)
    connectDB()
})