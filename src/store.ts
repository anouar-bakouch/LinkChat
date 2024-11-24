import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './features/user/userSlice';
import roomsReducer from './features/user/roomSlice';
import messagesReducer from './features/user/messageSlice';
import authReducer from './features/auth/authSlice'; // Import the auth reducer

export const store = configureStore({
  reducer: {
    users: usersReducer,
    rooms: roomsReducer,
    messages: messagesReducer,
    auth: authReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;