import express from 'express';
import { protectedroute } from '../utils/protectedRoute.js';
import {getNotifications,deleteNotifications} from '../controller/notificationController.js'
const router = express.Router();

router.get("/",protectedroute,getNotifications);
router.get("/delete",protectedroute,deleteNotifications);



export default router