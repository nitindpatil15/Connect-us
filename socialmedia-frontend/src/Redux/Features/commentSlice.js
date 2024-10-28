import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const host = "https://soco-backend-1.onrender.com/api/v1/comments";

// Fetch comments for a specific post
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${host}/${postId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer${Cookies.get("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch comments"
      );
    }
  }
);

// Add a new comment to a post
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${host}/${postId}`,
        { content },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer${Cookies.get("token")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add comment");
    }
  }
);

// Update a comment by its ID
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${host}/${commentId}`,
        { content },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer${Cookies.get("token")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update comment"
      );
    }
  }
);

// Delete a comment by its ID
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line
      const response = await axios.delete(
        `${host}/${commentId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer${Cookies.get("token")}`,
          },
        }
      );
      return commentId; // Return the ID for local removal in Redux state
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete comment"
      );
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        );
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentsSlice.reducer;
