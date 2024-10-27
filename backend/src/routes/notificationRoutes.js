import { Router } from "express";
import { getNotifications } from "../controllers/notification.controller.js";
import verifyJWT from "../middleware/authMiddleware.js";

const router = Router()

router.route('/').get(verifyJWT,getNotifications )

export default router