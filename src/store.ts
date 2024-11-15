import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import chatReducer from './features/user/chatSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
});

// Define RootState based on the store's state
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch if you need it elsewhere
export type AppDispatch = typeof store.dispatch;

export default store;