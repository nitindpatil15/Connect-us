import { ApiError } from "../utils/ApiError.js";
import user from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/User.model.js";
import Post from "../models/Post.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const UserToken = await user.findById(userId);
    const accessToken = UserToken.generateAccessToken();
    const refreshToken = UserToken.generateRefreshToken();
    console.log("generated accessToken: ", accessToken);
    console.log("generated refreshToken: ", refreshToken);

    UserToken.refreshToken = refreshToken;
    await UserToken.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong  while generating tokens");
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    console.log("Email: ", email);

    // for checking empty field
    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All Fields are Required");
    }

    // checking user isExists or not
    const existedUser = await user.findOne({
      $or: [{ email }, { username }],
    });
    if (existedUser) {
      throw new ApiError(409, "Username or Email already exists.");
    }

    // Checking for Avatar
    // const avatarLocalpath = req.files?.avatar?.[0]?.path;

    let avatarLocalpath;
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      avatarLocalpath = req.files.avatar[0].path;
    }

    if (!avatarLocalpath) {
      throw new ApiError(400, "Avatar is Required");
    }

    // uploading Files on Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalpath);
    if (!avatar) {
      throw new ApiError(500, "Failed to Upload Image On Server");
    }

    // User object
    const User = await user.create({
      fullName,
      avatar: avatar?.url,
      password,
      username,
      email,
    });
    console.log(User);

    // Removing password and refreshToken from object
    const createdUser = await user
      .find(user._id)
      .select("-password -refreshtoken");

    // Checking User Creation
    if (!createdUser) {
      throw new ApiError(500, "Somthing went wrong while creating the Account");
    }

    // sending Response to User
    return res
      .status(201)
      .json(new ApiResponse(200, User, "User Register Successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error ");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!(username || email)) {
      throw new ApiError(400, "Username and Email is required");
    }

    const UserDetail = await user.findOne({
      $or: [{ username }, { email }],
    });
    if (!UserDetail) {
      throw new ApiError(403, "Invalid Credentials");
    }

    // Password validating
    const passwordCompare = await bcrypt.compare(password, UserDetail.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({
        success,
        error: "Please try to login with correct credentials",
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      UserDetail._id
    );
    const loggedUser = await user.findById(UserDetail._id).select("-password ");
    console.log("_id: ", loggedUser._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(
        new ApiResponse(
          200,
          {
            UserDetail: loggedUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
          "User Logged Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Server Error ");
  }
};

const logoutUser = async (req, res) => {
  try {
    await user.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "following",
        select: "username fullName avatar", // Select only necessary fields
      })
      .populate({
        path: "followers",
        select: "username fullName avatar", // Select only necessary fields
      });

    const posts = await Post.find({ owner: req.user._id }).select(
      "title content image"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { user, posts }, "Profile fetched"));
  } catch (error) {
    throw new ApiError(500, "Server Error");
  }
};

const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .populate({
        path: "following",
        select: "username fullName avatar", // Select only necessary fields
      })
      .populate({
        path: "followers",
        select: "username fullName avatar", // Select only necessary fields
      });

    const posts = await Post.find({ owner: req.user._id }).select(
      "title content image"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { user, posts }, "Profile fetched"));
  } catch (error) {
    throw new ApiError(500, "Server Error");
  }
};

const getFeed = async (req, res) => {
  try {
    const { following } = await User.findById(req.user._id).select("following");

    const posts = await Post.find({
      owner: { $in: [...following, req.user._id] },
    })
      .populate("owner", "username avatar")
      .sort("-createdAt");

    return res.status(200).json(new ApiResponse(200, posts, "Feed fetched"));
  } catch (error) {
    throw new ApiError(500, "Server Error", error);
  }
};

const followUser = async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user;
  try {
    if (userId === currentUser._id.toString()) {
      throw new ApiError(400, "You cannot follow yourself");
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      throw new ApiError(404, "User not found");
    }

    // Check if the user is already followed
    if (userToFollow.followers.includes(currentUser._id)) {
      throw new ApiError(409, "Already following this user");
    }

    userToFollow.followers.push(currentUser._id);
    currentUser.following.push(userId);

    await Promise.all([userToFollow.save(), currentUser.save()]);

    // Send follow notification email
    sendFollowNotification(userToFollow.email, currentUser.username);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User followed successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Server Error");
  }
};

const unfollowUser = async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user;
  try {
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      throw new ApiError(404, "User not found");
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (follower) => follower.toString() !== currentUser._id.toString()
    );
    currentUser.following = currentUser.following.filter(
      (following) => following.toString() !== userId
    );

    await Promise.all([userToUnfollow.save(), currentUser.save()]);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User unfollowed successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Server Error");
  }
};

// Helper function to send email notification
const sendFollowNotification = async (recipientEmail, followerUsername) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Set up your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "New Follower",
    text: `${followerUsername} has started following you!`,
  };

  await transporter.sendMail(mailOptions);
};

const updateUserDetails =async (req, res) => {
  try {
    const { fullName, username } = req.body; 
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath && !fullName && !username) {
      throw new ApiError(400, "No updates provided. Avatar, FullName, or Username is required.");
    }

    // If an avatar is provided, upload it
    let avatarUrl;
    if (avatarLocalPath) {
      avatarUrl = await uploadOnCloudinary(avatarLocalPath);

      if (!avatarUrl.url) {
        throw new ApiError(400, "Error while uploading Avatar File");
      }
    }

    const updateData = {};
    if (avatarUrl) updateData.avatar = avatarUrl.url; 
    if (fullName) updateData.fullName = fullName; 
    if (username) updateData.username = username; 

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updateData },
      { new: true } 
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"));
  } catch (error) {
    console.log(error)
    throw new ApiError(500, "Problems during updating user details");
  }
};


export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getProfile,
  getFeed,
  followUser,
  unfollowUser,
  updateUserDetails
};
