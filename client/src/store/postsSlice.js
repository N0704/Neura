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

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
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

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle reaction
      .addCase(toggleReaction.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          // Update from server response
          post.reactions_count = action.payload.reactions_count;
          post.user_reaction = action.payload.user_reaction;
        }
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(action.payload.comment);
          post.comments_count = action.payload.comments_count;
        }
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
