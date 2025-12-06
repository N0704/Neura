import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { friendsAPI } from '../api/friendsAPI';

// Async thunks
export const fetchFriends = createAsyncThunk(
    'friends/fetchFriends',
    async (_, { rejectWithValue }) => {
        try {
            const response = await friendsAPI.getFriends();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách bạn bè');
        }
    }
);

export const fetchFriendRequests = createAsyncThunk(
    'friends/fetchFriendRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await friendsAPI.getFriendRequests();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải lời mời kết bạn');
        }
    }
);

export const sendFriendRequest = createAsyncThunk(
    'friends/sendRequest',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await friendsAPI.sendFriendRequest(userId);
            return { userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể gửi lời mời kết bạn');
        }
    }
);

export const acceptFriendRequest = createAsyncThunk(
    'friends/acceptRequest',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await friendsAPI.acceptFriendRequest(userId);
            return { userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể chấp nhận lời mời');
        }
    }
);

export const rejectFriendRequest = createAsyncThunk(
    'friends/rejectRequest',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await friendsAPI.rejectFriendRequest(userId);
            return { userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể từ chối lời mời');
        }
    }
);

export const cancelFriendRequest = createAsyncThunk(
    'friends/cancelRequest',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await friendsAPI.cancelFriendRequest(userId);
            return { userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể hủy lời mời');
        }
    }
);

export const unfriend = createAsyncThunk(
    'friends/unfriend',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await friendsAPI.unfriend(userId);
            return { userId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể hủy kết bạn');
        }
    }
);

export const getFriendStatus = createAsyncThunk(
    'friends/getStatus',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await friendsAPI.getFriendStatus(userId);
            return { userId, status: response.data.status };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy trạng thái');
        }
    }
);

const friendsSlice = createSlice({
    name: 'friends',
    initialState: {
        friends: [],
        friendRequests: [],
        friendStatuses: {}, // { userId: 'friends' | 'request_sent' | 'request_received' | 'none' }
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFriendStatus: (state, action) => {
            const { userId, status } = action.payload;
            state.friendStatuses[userId] = status;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch friends
            .addCase(fetchFriends.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFriends.fulfilled, (state, action) => {
                state.loading = false;
                state.friends = action.payload;
                // Update friend statuses
                action.payload.forEach(friend => {
                    state.friendStatuses[friend.id] = 'friends';
                });
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch friend requests
            .addCase(fetchFriendRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFriendRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.friendRequests = action.payload;
                // Update friend statuses
                action.payload.forEach(request => {
                    state.friendStatuses[request.user.id] = 'request_received';
                });
            })
            .addCase(fetchFriendRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Send friend request
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.friendStatuses[action.payload.userId] = 'request_sent';
            })

            // Accept friend request
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.friendStatuses[action.payload.userId] = 'friends';
                // Remove from requests
                state.friendRequests = state.friendRequests.filter(
                    req => req.user.id !== action.payload.userId
                );
            })

            // Reject friend request
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                state.friendStatuses[action.payload.userId] = 'none';
                state.friendRequests = state.friendRequests.filter(
                    req => req.user.id !== action.payload.userId
                );
            })

            // Cancel friend request
            .addCase(cancelFriendRequest.fulfilled, (state, action) => {
                state.friendStatuses[action.payload.userId] = 'none';
            })

            // Unfriend
            .addCase(unfriend.fulfilled, (state, action) => {
                state.friendStatuses[action.payload.userId] = 'none';
                state.friends = state.friends.filter(friend => friend.id !== action.payload.userId);
            })

            // Get friend status
            .addCase(getFriendStatus.fulfilled, (state, action) => {
                state.friendStatuses[action.payload.userId] = action.payload.status;
            });
    },
});

export const { clearError, setFriendStatus } = friendsSlice.actions;
export default friendsSlice.reducer;
