import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './features/user/userSlice';
import roomsReducer from './features/user/roomSlice';
import messagesReducer from './features/user/messageSlice';


export const store = configureStore({
  reducer: {
    users: usersReducer,
    rooms: roomsReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;