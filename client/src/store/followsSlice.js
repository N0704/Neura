import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { followsAPI } from '../api/followsAPI';

// Async thunks
export const fetchFollowers = createAsyncThunk(
    'follows/fetchFollowers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await followsAPI.getFollowers();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách người theo dõi');
        }
    }
);

export const fetchFollowing = createAsyncThunk(
    'follows/fetchFollowing',
    async (_, { rejectWithValue }) => {
        try {
            const response = await followsAPI.getFollowing();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách đang theo dõi');
        }
    }
);

export const followUser = createAsyncThunk(
    'follows/followUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await followsAPI.followUser(userId);
            return { userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể theo dõi người dùng');
        }
    }
);

export const unfollowUser = createAsyncThunk(
    'follows/unfollowUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await followsAPI.unfollowUser(userId);
            return { userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể bỏ theo dõi');
        }
    }
);

export const getFollowStatus = createAsyncThunk(
    'follows/getStatus',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await followsAPI.getFollowStatus(userId);
            return { userId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy trạng thái theo dõi');
        }
    }
);

const followsSlice = createSlice({
    name: 'follows',
    initialState: {
        followers: [],
        following: [],
        followStatuses: {}, // { userId: { is_following: bool, is_followed_by: bool } }
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFollowStatus: (state, action) => {
            const { userId, is_following, is_followed_by } = action.payload;
            state.followStatuses[userId] = { is_following, is_followed_by };
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch followers
            .addCase(fetchFollowers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowers.fulfilled, (state, action) => {
                state.loading = false;
                state.followers = action.payload;
            })
            .addCase(fetchFollowers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch following
            .addCase(fetchFollowing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowing.fulfilled, (state, action) => {
                state.loading = false;
                state.following = action.payload;
            })
            .addCase(fetchFollowing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Follow user
            .addCase(followUser.fulfilled, (state, action) => {
                if (!state.followStatuses[action.payload.userId]) {
                    state.followStatuses[action.payload.userId] = { is_following: true, is_followed_by: false };
                } else {
                    state.followStatuses[action.payload.userId].is_following = true;
                }
            })

            // Unfollow user
            .addCase(unfollowUser.fulfilled, (state, action) => {
                if (state.followStatuses[action.payload.userId]) {
                    state.followStatuses[action.payload.userId].is_following = false;
                }
                state.following = state.following.filter(user => user.id !== action.payload.userId);
            })

            // Get follow status
            .addCase(getFollowStatus.fulfilled, (state, action) => {
                state.followStatuses[action.payload.userId] = {
                    is_following: action.payload.is_following,
                    is_followed_by: action.payload.is_followed_by,
                };
            });
    },
});

export const { clearError, setFollowStatus } = followsSlice.actions;
export default followsSlice.reducer;
