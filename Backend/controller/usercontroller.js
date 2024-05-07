import Notification from "../models/notificationmodel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"

export const getuserprofile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log("Error in getUserProfile:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const followUnfollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow and unfollow yourself" });
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ unfollow: true });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            const newNotification = new Notification({
                type:"follow",
                from: req.user._id,
                to: id,
            })
            await newNotification.save();
            res.status(200).json({ follow: true });
        }
    } catch (error) {
        console.log("Error in followUnfollow:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $nin: [userId] } 
                }
            },
            { $sample: { size: 10 } }
        ]);
        const suggestedUsers = users.slice(0, 4);
        suggestedUsers.forEach(user => user.password = null);
        res.status(200).json({ suggestedUsers });
    } catch (error) {
        console.log("Error in getSuggestedUsers:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateuserprofile = async(req,res) =>{
   const {fullname, email, currentpassword,newpassword,bio,link} = req.body 
   const {profileimg,coverimg} = req.body
   const userid = req.user._id
   try {
    const user = await User.findById(userid)
    if(!user) {
        return res.status(404).json({error:"User not found"})
    }

    if((!newpassword && currentpassword)||(newpassword && !currentpassword)){
        return res.status(400).json({error:"Please enter both current password and new password"})
    }

    if(newpassword && currentpassword){
        const ismatch = await bcrypt.compare(currentpassword, user.password)
        if(!ismatch){
            return res.status(400).json({error:" password entered is incorrect"})
        }
        if(newpassword.length<6){
            return res.status(400).json({error:"password should be atleast 6 characters long"})
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newpassword,salt)
    }
    if(profileimg){

    }
    if(coverimg){
        
    }
} catch (error) {
    
   }
}

