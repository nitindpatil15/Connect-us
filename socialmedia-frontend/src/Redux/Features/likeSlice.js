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
      console.log("liked")
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
      console.log("liked")
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const likesSlice = createSlice({
  name: 'likes',
  initialState: {
    postLikes: {},
    commentLikes: {},
    loading: false,
    error: null,
  },
  reducers: {
    setPostLike: (state, action) => {
      const { postId, liked } = action.payload;
      state.postLikes[postId] = liked;
    },
    setCommentLike: (state, action) => {
      const { commentId, liked } = action.payload;
      state.commentLikes[commentId] = liked;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(togglePostLike.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        const liked = !state.postLikes[postId];
        state.postLikes[postId] = liked;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const commentId = action.meta.arg;
        const liked = !state.commentLikes[commentId];
        state.commentLikes[commentId] = liked;
      })
  },
});

export const { setPostLike, setCommentLike } = likesSlice.actions;
export default likesSlice.reducer;