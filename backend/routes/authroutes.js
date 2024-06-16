import express from "express"
import {signup,login,logout,getUser} from "../controller/authControllers.js"
import { protectedroute } from "../utils/protectedRoute.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.get("/User",protectedroute,getUser)
router.post("/logout",logout)


export default router