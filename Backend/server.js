import express from "express"
import authrouter from "./routes/authroutes.js"
import userrouter from "./routes/userroutes.js"
import postrouter from "./routes/postRoutes.js"
import notificationrouter from "./routes/notificationRoute.js"
import dotenv from "dotenv"
import connectDB from "./database/database.js"
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())
app.use("/api/auth",authrouter)
app.use("/api/user",userrouter)
app.use("/api/post",postrouter)
app.use("/api/notification",notificationrouter)

app.listen(5000,()=>{
    console.log("Server running on port 5000");
    connectDB()
})
