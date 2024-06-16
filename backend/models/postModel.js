import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
    },
    image: {
        data: { type: String, required: true }, // Change type to String
        contentType: { type: String, required: true },
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    comments: [{
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
