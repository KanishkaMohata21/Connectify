import express from 'express';
import { protectedroute } from '../utils/protectedRoute.js';
import {getuserprofile,updateuserprofile,followUnfollow,getSuggestedUsers} from '../controller/usercontroller.js';

const router = express.Router();

router.get("/profile/:username",protectedroute,getuserprofile)
router.get("/suggested",protectedroute,getSuggestedUsers)
router.post("/follow/:id",protectedroute,followUnfollow)
router.post("/update",protectedroute,updateuserprofile)

export default router