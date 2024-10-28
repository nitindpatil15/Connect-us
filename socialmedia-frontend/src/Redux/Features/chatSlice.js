import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Define initial state
const initialState = {
  messages: [],
  chatHistory: [],
  unreadMessages: [],
  loading: false,
  error: null,
};

const host = "https://soco-backend-1.onrender.com"

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${host}/api/v1/chat/send/${receiverId}`,
        { message },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer${Cookies.get("token")}`,
          },
        }
      );
      return response.data.data; // Assuming the message is returned in the data
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk to get chat history
export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${host}/api/v1/chat/history/${userId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer${Cookies.get("token")}`,
          },
        }
      );
      return response.data.data; // Assuming messages are in the data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchUnreadMessages = createAsyncThunk(
  "chat/fetchUnreadMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${host}/api/v1/chat/unread`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer${Cookies.get("token")}`,
          },
        }
      );
      return response.data.data; // Assuming unread messages are in the data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      // Add to chatHistory if needed
    },
    clearChat: (state) => {
      state.messages = [];
      state.chatHistory = [];
      state.error = null;
    },
    addMessageToHistory: (state, action) => {
      state.chatHistory.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); 
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory = action.payload; // Set chat history
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadMessages = action.payload; // Set unread messages
      })
      .addCase(fetchUnreadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearChat, addMessage,addMessageToHistory } = chatSlice.actions;
export default chatSlice.reducer;
