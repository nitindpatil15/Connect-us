import { Router } from "express";
import verifyJWT from '../middleware/authMiddleware.js'
import { upload } from "../middleware/multerMiddleware.js";
import { deletepost, getAllposts, getCurrentUserposts, getpostById, getpostbyUserId, publishApost, updatepost } from "../controllers/post.controller.js";

const router = Router();

router.route("/all-post").get(getAllposts)
  router.route('/').post(
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      }
    ]),verifyJWT,
    publishApost
  );

router.route('/user/posts').get(verifyJWT,getCurrentUserposts)
router.route('/user/posts/:id').get(verifyJWT,getpostbyUserId)
router
  .route("/:postId")
  .get(verifyJWT,getpostById)
  .delete(verifyJWT,deletepost)
  .patch(verifyJWT,updatepost);

export default router;