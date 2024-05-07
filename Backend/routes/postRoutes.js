import express from 'express';
import { protectedroute } from '../utils/protectedRoute.js';
import {createPost,likeUnlikePost,commentOnPost,deletePost,getAllPost,allfollowingpost,getuserPost} from "../controller/postController.js"

const router = express.Router();

router.post("/create",protectedroute,createPost)
router.post("/like/:id",protectedroute,likeUnlikePost)
router.post("/comment/:id",protectedroute,commentOnPost)
router.delete("/delete/:id",protectedroute,deletePost)
router.get("/allpost",protectedroute,getAllPost)
router.get("/allfollowingpost",protectedroute,allfollowingpost)
router.get("/userpost/:username",protectedroute,getuserPost)


export default router