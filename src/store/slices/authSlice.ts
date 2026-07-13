import { createSlice } from '@reduxjs/toolkit';
import { authApi, UserProfile } from '../api/authApi';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('auth_user'),
  user: localStorage.getItem('auth_user') 
    ? JSON.parse(localStorage.getItem('auth_user')!) 
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: { payload: { user: UserProfile } }
    ) {
      const { user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      localStorage.setItem('auth_user', JSON.stringify(user));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('auth_user');
      // Clear client-accessible cookies if any (httpOnly cookies must be cleared by backend logout endpoint)
      document.cookie = 'token=; Max-Age=0; path=/;';
      document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      }
    );
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

