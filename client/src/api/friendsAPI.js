import api from './http';

export const friendsAPI = {
    // Get list of friends
    getFriends: async () => {
        const response = await api.get('/friends');
        return response.data;
    },

    // Get friend requests received
    getFriendRequests: async () => {
        const response = await api.get('/friends/requests');
        return response.data;
    },

    // Get friendship status with a user
    getFriendStatus: async (userId) => {
        const response = await api.get(`/friends/status/${userId}`);
        return response.data;
    },

    // Send friend request
    sendFriendRequest: async (userId) => {
        const response = await api.post(`/friends/request/${userId}`);
        return response.data;
    },

    // Accept friend request
    acceptFriendRequest: async (userId) => {
        const response = await api.post(`/friends/accept/${userId}`);
        return response.data;
    },

    // Reject friend request
    rejectFriendRequest: async (userId) => {
        const response = await api.post(`/friends/reject/${userId}`);
        return response.data;
    },

    // Cancel friend request (sent by current user)
    cancelFriendRequest: async (userId) => {
        const response = await api.delete(`/friends/cancel/${userId}`);
        return response.data;
    },

    // Unfriend
    unfriend: async (userId) => {
        const response = await api.delete(`/friends/${userId}`);
        return response.data;
    },
};
