import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["like", "comment", "follow", "message"], // Types of notifications
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true }, // The user who triggers the notification
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true }, // The user who receives the notification
    content: { type: String }, // Optional: additional details like a comment or message
    post: { type: Schema.Types.ObjectId, ref: "Post" }, // Optional: referenced post if it's a like or comment
    read: { type: Boolean, default: false }, // To track if the notification has been read
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
