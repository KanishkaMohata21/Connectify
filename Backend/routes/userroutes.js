import express from 'express';
import { protectedroute } from '../utils/protectedRoute.js';
const router = express.Router();
import {getuserprofile,updateuserprofile,followUnfollow,getSuggestedUsers} from '../controller/usercontroller.js';

router.get("/profile/:username",protectedroute,getuserprofile)
router.get("/suggested",protectedroute,getSuggestedUsers)
router.post("/follow/:id",protectedroute,followUnfollow)
router.post("/update",protectedroute,updateuserprofile)

export default router