import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: sessionStorage.getItem('sessionToken') || null,
  username: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    clearUser: (state) => {
      state.token = null;
      state.username = null;
      sessionStorage.removeItem('sessionToken');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;