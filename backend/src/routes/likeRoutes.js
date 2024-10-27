import { Router } from 'express';
import { toggleCommentLike, togglePostLike } from "../controllers/like.controller.js"
import verifyJWT from "../middleware/authMiddleware.js";

const router = Router();

router.route("/toggle/p/:postId").post(verifyJWT,togglePostLike);
router.route("/toggle/c/:commentId").post(verifyJWT,toggleCommentLike);

export default router