import { createSlice } from '@reduxjs/toolkit';
import { authApi, UserProfile } from '../api/authApi';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('auth_token'),
  token: localStorage.getItem('auth_token'),
  user: localStorage.getItem('auth_user') 
    ? JSON.parse(localStorage.getItem('auth_user')!) 
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
