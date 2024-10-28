import { Like } from "../models/Like.model.js";
import Post from "../models/Post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/Comment.model.js";

const togglePostLike = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new ApiError(400, "Invalid post ID");
    }

    const userId = req.user?._id; // Ensure userId is an ObjectId

    // Validate post existence
    const isValidPost = await Post.findById(postId);
    if (!isValidPost) {
      throw new ApiError(404, "Post not found");
    }

    const like = await Like.findOne({ post: postId });

    if (!like) {
      // Create a new like entry
      const newLike = await Like.create({ post: postId, likes: [userId] });
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } }); // Adjust the likesCount field as necessary

      return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Liked the post!"));
    } else {
      if (!like.likes.includes(userId)) {
        // User has not liked yet, add their like
        like.likes.push(userId);
        await like.save();
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
        return res
          .status(200)
          .json(new ApiResponse(200, like, "Liked the post!"));
      } else {
        // User is unliking the post
        like.likes = like.likes.filter((id) => !id.equals(userId));
        await like.save();
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
        return res
          .status(200)
          .json(new ApiResponse(200, like, "Unliked the post"));
      }
    }
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw new ApiError(500, error.message || "Network problem");
  }
};

const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!commentId) {
      throw new ApiError(400, "Invalid comment ID");
    }

    const userId = req.user?._id; // Ensure userId is an ObjectId

    // Validate comment existence
    const isValidComment = await Comment.findById(commentId);
    if (!isValidComment) {
      throw new ApiError(404, "Comment not found");
    }

    const like = await Like.findOne({ comment: commentId });

    if (!like) {
      // Create a new like entry for the comment
      const newLike = await Like.create({
        comment: commentId,
        likes: [userId],
      });
      await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });

      return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Liked the comment!"));
    } else {
      if (!like.likes.includes(userId)) {
        // User has not liked yet, add their like
        like.likes.push(userId);
        await like.save();
        await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });
        return res
          .status(200)
          .json(new ApiResponse(200, like, "Liked the comment!"));
      } else {
        // User is unliking the comment
        like.likes = like.likes.filter((id) => !id.equals(userId));
        await like.save();
        await Comment.findByIdAndUpdate(commentId, {
          $inc: { likesCount: -1 },
        });
        return res
          .status(200)
          .json(new ApiResponse(200, like, "Unliked the comment"));
      }
    }
  } catch (error) {
    console.error("Error in toggleCommentLike:", error);
    throw new ApiError(500, error.message || "Network problem");
  }
};

export { togglePostLike, toggleCommentLike };
