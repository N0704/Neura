import api from './http';

export const followsAPI = {
    // Follow a user
    followUser: async (userId) => {
        const response = await api.post(`/follow/${userId}`);
        return response.data;
    },

    // Unfollow a user
    unfollowUser: async (userId) => {
        const response = await api.delete(`/follow/${userId}`);
        return response.data;
    },

    // Get list of followers
    getFollowers: async () => {
        const response = await api.get('/followers');
        return response.data;
    },

    // Get list of users being followed
    getFollowing: async () => {
        const response = await api.get('/following');
        return response.data;
    },

    // Get follow status with a user
    getFollowStatus: async (userId) => {
        const response = await api.get(`/follow/status/${userId}`);
        return response.data;
    },
};
