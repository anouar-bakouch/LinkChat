import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import chatReducer from './features/user/chatSlice';
import authReducer from './features/auth/authSlice'; // Import the auth reducer

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    auth: authReducer, // Add the auth reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;