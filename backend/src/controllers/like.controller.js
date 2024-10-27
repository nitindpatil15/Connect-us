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

    const userId = req.user?._id; // Corrected here
    const condition = { likes: userId, post: postId };

    // Validate post existence
    const isValidPost = await Post.findById(postId);
    if (!isValidPost) {
      throw new ApiError(404, "Post not found");
    }

    const like = await Like.findOne(condition);

    if (!like) {
      // Create a new like
      const newLike = await Like.create({ post: postId, likes: userId });
      await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } }); // Correct increment

      return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Liked the post!"));
    } else {
      // Remove existing like
      const removeLike = await Like.findOneAndDelete(condition);
      await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } }); // Correct decrement

      return res
        .status(200)
        .json(new ApiResponse(200, removeLike, "Unliked the post"));
    }
  } catch (error) {
    console.error("Error in togglePostLike:", error); // Improved logging
    throw new ApiError(500, error.message || "Network problem");
  }
};

const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!commentId) {
      throw new ApiError(400, "Invalid comment ID");
    }

    const userId = req.user?._id; // Corrected here
    const condition = { likes: userId, comment: commentId };

    // Validate comment existence
    const isValidComment = await Comment.findById(commentId);
    if (!isValidComment) {
      throw new ApiError(404, "Comment not found");
    }

    const like = await Like.findOne(condition);

    if (!like) {
      // Create a new like for comment
      const newLike = await Like.create({ comment: commentId, likes: userId });
      await Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } }); // Increment likes on comment

      return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Liked the comment!"));
    } else {
      // Remove existing like from comment
      const removeLike = await Like.findOneAndDelete(condition);
      await Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } }); // Decrement likes on comment

      return res
        .status(200)
        .json(new ApiResponse(200, removeLike, "Unliked the comment"));
    }
  } catch (error) {
    console.error("Error in toggleCommentLike:", error); // Improved logging
    throw new ApiError(500, error.message || "Network problem");
  }
};

export { togglePostLike, toggleCommentLike };
