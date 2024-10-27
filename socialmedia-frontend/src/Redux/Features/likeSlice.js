import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from "js-cookie"

const API_URL = 'http://localhost:8237/api/v1/likes';

// Thunks for toggling likes on posts and comments
export const togglePostLike = createAsyncThunk(
  'likes/togglePostLike',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/toggle/p/${postId}`,{},{
        withCredentials:true,
        headers:{
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'likes/toggleCommentLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/toggle/c/${commentId}`,{},{
        withCredentials:true,
        headers:{
          Authorization: `Bearer${Cookies.get("accessToken")}`,
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const likesSlice = createSlice({
  name: 'likes',
  initialState: {
    postLikes: {}, // Stores post ID and like status
    commentLikes: {}, // Stores comment ID and like status
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(togglePostLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {
        state.loading = false;
        const postId = action.meta.arg;
        state.postLikes[postId] = !state.postLikes[postId]; // Toggle like status
      })
      .addCase(togglePostLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to like/unlike post';
      })
      .addCase(toggleCommentLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.loading = false;
        const commentId = action.meta.arg;
        state.commentLikes[commentId] = !state.commentLikes[commentId]; // Toggle like status
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to like/unlike comment';
      });
  },
});

export default likesSlice.reducer;
