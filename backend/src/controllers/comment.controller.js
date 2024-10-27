import mongoose from "mongoose";
import Post from "../models/Post.model.js";
import { Comment } from "../models/Comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(402, "Invalid Post Id");
    }
    if (!content) {
      throw new ApiError(402, "All Fields Are required");
    }
    if (!userId) {
      throw new ApiError(401, "Unauthorized User");
    }

    const postComment = await Comment.create({
      content,
      post: postId,
      owner: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, postComment, "Commented on Post"));
  } catch (error) {
    throw new ApiError(500, "Server Error");
  }
};

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params; //postId
    const { page = 1, limit = 10 } = req.params;

    const isValidPost = await Post.findById(postId);

    if (!isValidPost) {
      throw new ApiError(402, "Invalid Post");
    }

    const comments = await Comment.aggregate([
      {
        $match: { post: new mongoose.Types.ObjectId(`${postId}`) },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!comments) {
      throw new ApiError(402, "No Comments");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Post All Comments"));
  } catch (error) {
    throw new ApiError(401, "Server Error...");
  }
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const {content} = req.body
  if (!commentId) {
    throw new ApiError(402, "Id is required");
  }
  try {
    const updatedcomment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content,
        },
      },
      { new: true }
    );

    if (!updatedcomment) {
      throw new ApiError(402, "Failed to Edit Comment");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedcomment, "Comment Updated"));
  } catch (error) {
    throw new ApiError(500, error || "Server Error");
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(402, "Id is required");
  }
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      throw new ApiError(402, "Failed to Delete Comment");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, deletedComment, "Comment Deleted"));
  } catch (error) {
    throw new ApiError(500, error || "Server Error");
  }
};

export { getPostComments, addComment, updateComment, deleteComment };
