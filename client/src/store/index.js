import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import messagesReducer from './messagesSlice';
import friendsReducer from './friendsSlice';
import followsReducer from './followsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    messages: messagesReducer,
    friends: friendsReducer,
    follows: followsReducer,
  },
});
