import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearAuthToken(state) {
      state.token = null;
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export default authSlice.reducer;