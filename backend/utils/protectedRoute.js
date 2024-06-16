import User from "../models/userModel.js";
import jwt from "jsonwebtoken"

export const protectedroute = async (req, res, next) => {
    try {
        console.log("Starting")
        console.log(req.headers.authorization)
        // console.log(req.cookies)
        // console.log(req.cookies.jwt)
        const token = req.headers.authorization
        console.log(token);
        if (!token) {
            console.log('WHyyyyyyy')
            return res.status(401).json({ error: "You are not logged in" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ error: "Invalid Token" })
        }
        const user = await User.findById(decoded.user_id).select("-password")
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        req.user = user
        next()
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({ error: "Internal server error during get user" });
    }
}