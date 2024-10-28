import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Define the base API URL at the top
const host = "http://localhost:8237/api/v1/posts";

// Async thunk for fetching all posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${host}/all-post`);
      console.log(response);
      return response.data.data.allposts; // Access the posts array directly
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch posts");
    }
  }
);

// Async thunk for publishing a post
export const publishPost = createAsyncThunk(
  "posts/publishPost",
  async ({ title, content, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      const response = await axios.post(`${host}/`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to publish post");
    }
  }
);

// Async thunk for fetching a post by ID
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${host}/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer${Cookies.get("accessToken")}` },
      });
      console.log(response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch post");
    }
  }
);

// Async thunk for updating a post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, title, content }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${host}/${postId}`,
        { title, content },
        {
          withCredentials:true,
          headers: { Authorization: `Bearer${Cookies.get("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update post");
    }
  }
);

// Async thunk for deleting a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${host}/${postId}`, {
          withCredentials:true,
          headers: { 
            Authorization: `Bearer${Cookies.get("token")}` 
          },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete post");
    }
  }
);

// Async thunk for fetching current user's posts
export const fetchCurrentUserPosts = createAsyncThunk(
  "posts/fetchCurrentUserPosts",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${host}/user/posts`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user posts"
      );
    }
  }
);

export const fetchUserPostsById = createAsyncThunk(
  "posts/fetchUserPostsById",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${host}/user/posts/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user posts"
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    currentUserPosts: [],
    singlePost: null,
    userpostById: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(publishPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(publishPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(publishPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg.postId
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCurrentUserPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserPosts = action.payload;
      })
      .addCase(fetchCurrentUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserPostsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPostsById.fulfilled, (state, action) => {
        state.loading = false;
        state.userpostById = action.payload;
      })
      .addCase(fetchUserPostsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;
