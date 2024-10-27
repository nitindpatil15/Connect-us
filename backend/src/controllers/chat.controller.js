import Chat from "../models/Chat.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { io } from "../index.js";

const sendMessage = asynchandler(async (req, res) => {
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
    console.log(error)
    throw new ApiError(500, `Server Error:${error}`);
  }
});

const getChatHistory = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  // Find a chat with the specified user
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
    throw new ApiError(500,`Server Error:${error}`)
  }
};

export { sendMessage,getChatHistory };
