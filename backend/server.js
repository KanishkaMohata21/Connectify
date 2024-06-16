import express from "express"
import authrouter from "./routes/authroutes.js"
import userrouter from "./routes/userroutes.js"
import postrouter from "./routes/postRoutes.js"
import notificationrouter from "./routes/notificationRoute.js"
import chatRoutes from "./routes/chatRoutes.js"
import dotenv from "dotenv"
import connectDB from "./database/database.js"
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";
import cors from 'cors'; 
import bodyParser  from 'body-parser';
import messageRoutes from './routes/messageRoutes.js'

const app = express()

app.use(cors({
    origin: 'http://localhost:3000', 
}));

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())
app.use("/api/auth",authrouter)
app.use("/api/user",userrouter)
app.use("/api/post",postrouter)
app.use("/api/notification",notificationrouter)
app.use("/api/chat",chatRoutes)
app.use("/api/messages",messageRoutes)

app.listen(5000,()=>{
    console.log("Server running on port 5000");
    connectDB()
})
