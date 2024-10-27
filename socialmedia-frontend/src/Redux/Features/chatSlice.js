import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from "js-cookie"

// Define initial state
const initialState = {
  messages: [],
  chatHistory: [],
  loading: false,
  error: null,
};

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:8237/api/v1/chat/send/${receiverId}`, { message },{
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return response.data.data; // Assuming the message is returned in the data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk to get chat history
export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8237/api/v1/chat/history/${userId}`,{
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return response.data.data; // Assuming messages are in the data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.chatHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle sendMessage actions
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); // Add the new message to messages array
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetchChatHistory actions
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
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
