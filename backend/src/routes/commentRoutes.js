import { Router } from "express";
import verifyJWT from "../middleware/authMiddleware.js";
import {
  addComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router(verifyJWT);

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:postId").get(getPostComments).post(addComment);

router.route("/:commentId").patch(updateComment).delete(deleteComment);

export default router;
