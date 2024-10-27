import { Router } from "express";
import verifyJWT from "../middleware/authMiddleware.js";
import { getChatHistory, sendMessage } from "../controllers/chat.controller.js";

const router = Router()


router.post("/send/:receiverId", verifyJWT, sendMessage);   // Send Message
router.get("/history/:userId", verifyJWT, getChatHistory);  // Get Chat History
export default router