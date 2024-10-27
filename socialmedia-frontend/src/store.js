import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Redux/Features/userSlice";
import postReducer from "./Redux/Features/postSlice";
import commentReducer from "./Redux/Features/commentSlice";
import likeReducer from "./Redux/Features/likeSlice";
import chatReducer from "./Redux/Features/chatSlice";
import notificationReducer from "./Redux/Features/notifiSlice";

const store = configureStore({
  reducer: {
    auth: userReducer,
    posts: postReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    comments: commentReducer,
    likes: likeReducer,
  },
});

export default store;
