import api from './http';

export const postsAPI = {
    // Get all posts
    getPosts: async (page = 1, perPage = 10) => {
        const response = await api.get('/posts', {
            params: { page, per_page: perPage }
        });
        return response.data;
    },

    // Create a new post
    createPost: async (postData) => {
        // Send JSON data with media URLs (uploaded from client)
        const data = {
            content: postData.content || '',
            background: postData.background || null,
            feeling: postData.feeling || null,
            privacy: postData.privacy || 'public',
        };

        // Add media info if uploaded to Cloudinary
        if (postData.media_url) {
            data.media_url = postData.media_url;
            data.media_public_id = postData.media_public_id;
            data.media_type = postData.media_type;
        }

        try {
            const response = await api.post('/posts', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Không thể đăng bài viết';
            throw new Error(errorMessage);
        }
    },

    // Get a single post
    getPostById: async (id) => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    // Update a post
    updatePost: async (id, postData) => {
        // Nếu có file, dùng FormData
        const hasFile = postData.image && postData.image instanceof File;

        let data;
        let headers = {};

        if (hasFile) {
            data = new FormData();
            data.append('content', postData.content || '');

            if (postData.image) {
                data.append('media', postData.image);
            }

            if (postData.background) {
                data.append('background', postData.background);
            }

            if (postData.feeling) {
                data.append('feeling', postData.feeling);
            }

            if (postData.privacy) {
                data.append('privacy', postData.privacy);
            }

            if (postData.remove_media && Array.isArray(postData.remove_media)) {
                postData.remove_media.forEach(id => {
                    data.append('remove_media[]', id);
                });
            }

            headers['Content-Type'] = 'multipart/form-data';
        } else {
            data = postData;
        }

        try {
            const response = await api.put(`/posts/${id}`, data, { headers });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Không thể cập nhật bài viết';
            throw new Error(errorMessage);
        }
    },

    // Delete a post
    deletePost: async (id) => {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    },

    // Toggle reaction on a post
    toggleReaction: async (postId, type = 'like') => {
        const response = await api.post(`/posts/${postId}/reaction`, { type });
        return response.data;
    },

    // Add comment to a post
    addComment: async (postId, content) => {
        const response = await api.post(`/posts/${postId}/comment`, { content });
        return response.data;
    },

    // Search posts
    searchPosts: async (query, page = 1, perPage = 20) => {
        const response = await api.get('/posts/search/query', {
            params: { q: query, page, per_page: perPage }
        });
        return response.data;
    },

    // Get user photos
    getUserPhotos: async (userId) => {
        const response = await api.get(`/users/${userId}/photos`);
        return response.data;
    },

    // Get user posts
    getUserPosts: async (userId, page = 1) => {
        const response = await api.get(`/users/${userId}/posts`, {
            params: { page }
        });
        return response.data;
    },
};
