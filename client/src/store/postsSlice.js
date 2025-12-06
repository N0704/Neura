import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postsAPI } from "../api/postsAPI";
import { assets } from "../assets/assets";

// Async thunks for API calls
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, perPage = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getPosts(page, perPage);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải bài viết');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postsAPI.createPost(postData);
      return response.data;
    } catch (error) {
      // Xử lý lỗi tốt hơn
      const errorMessage = error?.message || error.response?.data?.message || 'Không thể đăng bài viết';
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleReaction = createAsyncThunk(
  'posts/toggleReaction',
  async ({ postId, type = 'like' }, { rejectWithValue }) => {
    try {
      const response = await postsAPI.toggleReaction(postId, type);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể reaction');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await postsAPI.addComment(postId, content);
      return {
        postId,
        comment: response.data,
        comments_count: response.comments_count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm bình luận');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async ({ userId, page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getUserPosts(userId, page);
      return response.data; // response.data is the paginator object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải bài viết người dùng');
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    userPosts: [], // Store posts for specific user profile
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserPosts: (state) => {
      state.userPosts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts (Feed)
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data || action.payload;
        state.currentPage = action.payload.current_page || 1;
        state.totalPages = action.payload.last_page || 1;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user posts (Profile)
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        // Handle pagination data if present
        state.userPosts = action.payload.data || action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        // Also add to userPosts if it's the current user's profile
        state.userPosts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle reaction
      .addCase(toggleReaction.fulfilled, (state, action) => {
        // Update in main feed
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.reactions_count = action.payload.reactions_count;
          post.user_reaction = action.payload.user_reaction;
        }

        // Update in user profile posts
        const userPost = state.userPosts.find(p => p.id === action.payload.postId);
        if (userPost) {
          userPost.reactions_count = action.payload.reactions_count;
          userPost.user_reaction = action.payload.user_reaction;
        }
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        // Update in main feed
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(action.payload.comment);
          post.comments_count = action.payload.comments_count;
        }

        // Update in user profile posts
        const userPost = state.userPosts.find(p => p.id === action.payload.postId);
        if (userPost) {
          if (!userPost.comments) userPost.comments = [];
          userPost.comments.push(action.payload.comment);
          userPost.comments_count = action.payload.comments_count;
        }
      });
  },
});

export const { clearError, clearUserPosts } = postsSlice.actions;
export default postsSlice.reducer;
