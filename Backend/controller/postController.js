import Post from '../models/postModel.js'
import User from '../models/userModel.js'
import Notification from '../models/notificationmodel.js'
import { v2 as cloudinary } from 'cloudinary'

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userid = req.user._id.toString();

        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!text && !img) {
            return res.status(400).json({ error: "Please enter text or image" });
        }

        if (img) {
            const result = await cloudinary.uploader.upload(img);
            img = result.secure_url;

        }

        const newPost = new Post({
            text: text,
            img: img,
            user: user._id,
        })

        const post = await newPost.save();
        return res.status(200).json({ message: "Post created successfully", post: post });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error during post creation" });
    }
}
export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        console.log("id:", id);
        console.log("req.params:", req.params);

        const post = await Post.findById(id); 

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const alreadyLikedPost = post.likes.includes(userId);

        if (alreadyLikedPost) {
            await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
        } else {
            post.likes.push(userId);

            const notification = new Notification({
                type: "like",
                from: userId,
                to: post.user,
            });
            await notification.save();
        }

        await post.save();

        return res.status(200).json({ message: "Like status updated successfully", post });

    } catch (error) {
        console.error("Error in likeUnlikePost:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate("user").populate("comments.user");
        if (posts.length === 0) {
            return res.status(404).json({ error: "No posts found" });
        }
        return res.status(200).json({ message: "All posts fetched successfully", posts: posts });
    } catch (error) {
        console.error("Error getting all posts:", error);
        return res.status(500).json({ error: "Internal server error during all post fetch" });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { id } = req.params;
        const userid = req.user._id;
        if (!text) {
            return res.status(400).json({ error: "Please enter text" });
        }
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const comment = { user: userid, text }

        post.comments.push(comment);
        await post.save();
        return res.status(200).json({ message: "Comment created successfully", post: post });

    } catch (error) {
        console.error("Error commenting on post:", error);
        return res.status(500).json({ error: "Internal server error during commenting on post" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ error: "Internal server error during post deletion" });
    }
}

export const allfollowingpost = async (req, res) => {
    try {
        const userid = req.user._id;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const following = user.following;
        const posts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate("user").populate("comments.user");
        if (posts.length === 0) {
            return res.status(404).json({ error: "No posts found" });
        }
        return res.status(200).json({ message: "All posts fetched successfully", posts: posts });
        
    } catch (error) {
        console.error("Error getting all posts:", error);
        return res.status(500).json({ error: "Internal server error" });        
    }
}

export const getuserPost = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate("user").populate("comments.user");
        if (posts.length === 0) {
            return res.status(404).json({ error: "No posts found" });
        }
        return res.status(200).json({ message: "All user posts fetched successfully", posts: posts });
        
    } catch (error) {
        console.error("Error getting all user posts:", error);
        return res.status(500).json({ error: "Internal server error" });       
    }
}