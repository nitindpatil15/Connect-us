import Chat from "../models/Chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { io } from "../index.js";

const sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { message } = req.body;
  const senderId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = {
      sender: senderId,
      content: message,
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Emit the message to the receiver
    io.to(receiverId).emit("newMessage", newMessage);

    return res
      .status(200)
      .json(new ApiResponse(200, newMessage, "Message sent successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, `Server Error:${error}`);
  }
};

const getChatHistory = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters
  const currentUserId = req.user._id;

  // Check if userId is provided and is a valid ObjectId
  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User ID is required."));
  }

  try {
    const chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
    }).populate("messages.sender", "username avatar");

    if (!chat) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No chat history found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, chat.messages, "Chat history fetched successfully")
      );
  } catch (error) {
    console.error(error); // Log the error for better debugging
    throw new ApiError(500, `Server Error: ${error.message}`);
  }
};

const getUnreadMessages = async (req, res) => {
  const userId = req.user._id;

  try {
    const chats = await Chat.find({ participants: userId });
    const unreadMessages = chats.flatMap((chat) =>
      chat.messages.filter(
        (msg) => msg.sender.toString() !== userId && !msg.read
      )
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          unreadMessages,
          "Unread messages fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, `Server Error:${error}`);
  }
};

export { sendMessage, getChatHistory, getUnreadMessages };
