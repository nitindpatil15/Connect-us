import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";

const getAllposts = async (req, res) => {
  try {
    const posts = await Post.find({});

    const allposts = await Promise.all(
      posts.map(async (post) => {
        const owner = await User.findById(post.owner);
        return {
          ...post._doc, // Copy post data
          owner: {
            id: owner._id,
            username: owner.username,
            avatar: owner.avatar,
          },
        };
      })
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { allposts }, "Posts fetched successfully"));
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new ApiError(500, "Failed to fetch posts. Please try again.");
  }
};

const publishApost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if ([title, content].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All Fields are Required");
    }

    let imageLocalpath;
    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      imageLocalpath = req.files.image[0].path;
    }

    const image = imageLocalpath
      ? await uploadOnCloudinary(imageLocalpath)
      : {};

    const createpost = await Post.create({
      image: image?.url || "",
      title,
      content,
    });

    createpost.owner = req.user;
    createpost.save();

    req.user.post = createpost;
    req.user.save();

    console.log(createpost);

    return res
      .status(200)
      .json(new ApiResponse(200, createpost, "post Uploaded Successfully"));
  } catch (error) {
    throw new ApiError(500, "something goes wrong ! try again after sometime");
  }
};

const getpostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const postById = await Post.findById(postId);

    if (!postById) {
      throw new ApiError("Error while fetching post");
    }
    console.log(postById);
    const user = await User.findById(postById.owner);
    return res
      .status(200)
      .json(new ApiResponse(200, { postById, user }, "post fetched by postId"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error in fetching post by Id");
  }
};

const updatepost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    if (!postId) {
      throw new ApiError("Id is required");
    }
    if (!title) {
      throw new ApiError("Title are required");
    }

    const postUpdate = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
      },
      {
        new: true,
      }
    );

    if (!postUpdate) {
      throw new ApiError("Server Error try later!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { postUpdate }, "post updated successfully!"));
  } catch (error) {
    throw new ApiError(500, "Error in Updating post");
  }
};

const deletepost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      throw new ApiError("Id is required");
    }

    const removepost = await Post.findByIdAndDelete(postId);

    if (!removepost) {
      throw new ApiError("Invalid Id please check it or try again!!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, removepost, "post Deleted Successfully!!"));
  } catch (error) {
    throw new ApiError(500, "Error in Deleting post");
  }
};

const getCurrentUserposts = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new ApiError("Unauthorized", 401);
    }

    const channelsallposts = await Post.find({ owner: userId });
    if (!channelsallposts) {
      throw new ApiError("No posts found", 201);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelsallposts,
          "All posts are fetched successfully!!!"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Server error , try after sometimes!!!");
  }
};

const getpostbyUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const userPosts = await Post.find({ owner: id });
    if (!userPosts.length) {
      throw new ApiError("Invalid Id, please check it or try again!", 404);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, userPosts, "Fetched user posts by ID"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error?.message || "Server Error");
  }
};

export {
  getAllposts,
  publishApost,
  updatepost,
  deletepost,
  getpostById,
  getCurrentUserposts,
  getpostbyUserId,
};
