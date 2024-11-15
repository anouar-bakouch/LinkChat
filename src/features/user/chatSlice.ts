import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsersApi, fetchMessagesApi } from '../../components/chatApi';
import { ChatState } from '../../models/ChatState';
import { User } from '../../models/User';
import { Message } from '../../models/Message';
import { RootState } from '../../store'; 

const initialState: ChatState = {
  users: [],
  messages: [],
  currentUser: null,
};

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk<User[], void>(
  'chat/fetchUsers',
  async () => {
    const users = await fetchUsersApi();
    return users;
  }
);

// Async thunk to fetch messages for a specific user
export const fetchMessages = createAsyncThunk<Message[], string>(
  'chat/fetchMessages',
  async (userId: string) => {
    const messages = await fetchMessagesApi(userId);
    return messages;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.messages = action.payload;
      });
  },
});

export const { setCurrentUser } = chatSlice.actions;

// Selector functions using RootState
export const selectUsers = (state: RootState) => state.chat.users;
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectCurrentUser = (state: RootState) => state.chat.currentUser;

export default chatSlice.reducer;