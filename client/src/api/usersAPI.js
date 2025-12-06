import api from './http';

export const usersAPI = {
    // Search users
    searchUsers: async (query, page = 1, perPage = 20) => {
        const response = await api.get('/users/search', {
            params: { q: query, page, per_page: perPage }
        });
        return response.data;
    },

    // Get user suggestions
    getSuggestions: async () => {
        const response = await api.get('/users/suggestions');
        return response.data;
    },

    // Get user profile
    getUserProfile: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    // Get user friends
    getUserFriends: async (userId) => {
        const response = await api.get(`/users/${userId}/friends`);
        return response.data;
    },
};
