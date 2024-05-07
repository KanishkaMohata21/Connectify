import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/tokenGeneration.js";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Received email:", email);
        console.log("Received name:", username);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error("Invalid email format"); 
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.error("Username already taken"); 
            return res.status(400).json({ error: "Username already taken" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            console.error("Email already taken");
            return res.status(400).json({ error: "Email already taken" });
        }

        if(password.length <6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error); 
        return res.status(500).json({ error: "Internal server error during signup" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        console.error("Login error:", error); 
        return res.status(500).json({ error: "Internal server error during login" });
    }
};

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "logout successfully"})
    } catch (error) {
        console.error("Logout error:", error); 
        return res.status(500).json({ error: "Internal server error during logout" });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Get user error:", error); 
        return res.status(500).json({ error: "Internal server error during get user" });
    }
}