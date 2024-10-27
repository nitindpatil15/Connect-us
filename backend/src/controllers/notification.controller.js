import Notification from "../models/Notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ receiver: userId }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notifications,
          "Notifications fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error ? error : "Internal Server Error");
  }
};

export { getNotifications };
