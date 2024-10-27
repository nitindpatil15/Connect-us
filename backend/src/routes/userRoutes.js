import { Router } from "express";
import {
  getCurrentUser,
  logoutUser,
  registerUser,
  loginUser,
  unfollowUser,
  followUser,
  getProfile,
  getFeed,
} from "../controllers/user.controller.js";
import verifyJWT from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profile").get(verifyJWT, getCurrentUser);
router.route("/profile/:userId").get(verifyJWT, getProfile);
router.route("/feed/").get(verifyJWT, getFeed);
router.route("/follow/:userId").patch(verifyJWT, followUser);
router.route("/unfollow/:userId").patch(verifyJWT, unfollowUser);

export default router;
