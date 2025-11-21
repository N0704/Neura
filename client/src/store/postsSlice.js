import { createSlice } from "@reduxjs/toolkit";
import { posts as initialPosts, assets } from "../assets/assets";

const defaultPrivacy = { value: "public", label: "Công khai" };

const postsInit = initialPosts.map((post) => ({
  ...post,
  liked: false,
  comments: post.comments || [],
  reactionType: null,
}));

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: postsInit,
  },
  reducers: {
    // CREATE POST
    addPost: {
      reducer(state, action) {
        if (action.payload) state.posts.unshift(action.payload);
      },
      prepare({
        content,
        image,
        background = null,
        feeling = null,
        privacy = defaultPrivacy,
      }) {
        const sanitizedContent = content?.trim() || "";

        // ❗Quan trọng: trả về skipAddPost để Redux không thêm null
        if (!sanitizedContent && !image && !background && !feeling) {
          return { payload: undefined };
        }

        const privacyValue =
          typeof privacy === "string"
            ? privacy
            : privacy?.value || defaultPrivacy.value;

        const privacyLabel =
          typeof privacy === "object" && privacy?.label
            ? privacy.label
            : privacyValue === "friends"
            ? "Bạn bè"
            : privacyValue === "private"
            ? "Chỉ mình tôi"
            : defaultPrivacy.label;

        return {
          payload: {
            id: Date.now(),
            user: {
              id: "current-user",
              name: "Nghia Bui",
              avatar: assets.avatar,
            },
            content: sanitizedContent,
            image: image || null,
            background: background || null,
            feeling: feeling || null,
            privacy: privacyValue,
            privacyLabel,
            time: "Vừa xong",
            comments_count: 0,
            reactions_count: 0,
            shares_count: 0,
            liked: false,
            comments: [],
            reactionType: null,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },

    // LIKE
    toggleLike(state, action) {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      const wasLiked = post.liked;
      post.liked = !wasLiked;
      post.reactionType = wasLiked ? null : "like";
      post.reactions_count = wasLiked
        ? Math.max(0, post.reactions_count - 1)
        : post.reactions_count + 1;
    },

    // COMMENT
    addComment(state, action) {
      const { postId, commentText } = action.payload;
      if (!commentText.trim()) return;

      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      post.comments.push({
        id: Date.now(),
        user: { id: "current-user", name: "Nghia Bui", avatar: assets.avatar },
        text: commentText.trim(),
        time: "Vừa xong",
      });

      post.comments_count += 1;
    },

    // SHARE
    sharePost(state, action) {
      const post = state.posts.find((p) => p.id === action.payload);
      if (!post) return;

      post.shares_count += 1;
    },
  },
});

export const { addPost, toggleLike, addComment, sharePost } =
  postsSlice.actions;
export default postsSlice.reducer;
