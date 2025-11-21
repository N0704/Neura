import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/http';

const TOKEN_KEY = 'neura_token';
const USER_KEY = 'neura_user';

const initialState = {
  user: (() => {
    const stored = window.localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  })(),
  token: window.localStorage.getItem(TOKEN_KEY),
  initializing: true,
  status: 'idle',
  error: null,
};

// Thunk này để init trạng thái auth đầu app
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return { user: null, token: null };
    }
    try {
      const response = await api.get('/me');
      if (response.data?.user) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        return { user: response.data.user, token };
      }
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      return { user: null, token: null };
    } catch {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      return { user: null, token: null };
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/login', credentials);
      window.localStorage.setItem(TOKEN_KEY, data.token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return { token: data.token, user: data.user };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Đăng nhập thất bại';
      return rejectWithValue(msg);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/register', payload);
      window.localStorage.setItem(TOKEN_KEY, data.token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return { token: data.token, user: data.user };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Đăng ký thất bại';
      return rejectWithValue(msg);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await api.post('/logout');
    } catch {
      // ignore server errors
    } finally {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload;
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      state.token = token;
      state.user = user;
    },
    clearAuth(state) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      state.token = null;
      state.user = null;
    },
    setInitializing(state, action) {
      state.initializing = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.initializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.initializing = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.initializing = false;
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.initializing = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
        state.initializing = false;
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.initializing = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
        state.initializing = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.initializing = false;
      });
  },
});

export const { setCredentials, clearAuth, setInitializing, setStatus } = authSlice.actions;
export default authSlice.reducer;
