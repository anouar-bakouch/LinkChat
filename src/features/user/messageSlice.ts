import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import axios from 'axios';
import { Message} from '../../models/Message';
import { Messagegrp } from '../../models/Messagegrp';
import { MessageState } from '../../models/MessageState';


export const fetchMessages = createAsyncThunk<Message[], { receiverId: number; receiverType: string }, { rejectValue: string }>(
  'messages/fetchMessages',
  async ({ receiverId, receiverType }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return rejectWithValue('Token missing');

      const response = await axios.get(`/api/messagesget?receiver_id=${receiverId}&receiver_type=${receiverType}`, {
        headers: {
          'Authentication': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Fetch messages for groups (listgrp)
export const fetchMessagesGrp = createAsyncThunk<Messagegrp[], { receiverId: number; receiverType: string }, { rejectValue: string }>(
  'messages/fetchMessagesGrp',
  async ({ receiverId, receiverType }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return rejectWithValue('Token missing');

      const response = await axios.get(`/api/messagesget?receiver_id=${receiverId}&receiver_type=${receiverType}`, {
        headers: {
          'Authentication': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Send text message
export const sendMessage = createAsyncThunk<Message, { receiverId: number; content: string }, { rejectValue: string }>(
  'messages/sendMessage',
  async ({ receiverId, content }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const senderId = Number(sessionStorage.getItem('id'));

      if (!token || !senderId) return rejectWithValue('Token or sender ID missing');

      const response = await axios.post(
        '/api/messages',
        {
          receiver_id: receiverId,
          content: content,
          image_url: '',
          sender_id: senderId,
          receiver_type: 'user',
        },
        {
          headers: {
            'Authentication': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Update the uploadImageMessage thunk to handle both 'user' and 'group' message types.
export const uploadImageMessage = createAsyncThunk<
  Message,
  { file: File; receiverId: number; receiverType: string; content: string },
  { rejectValue: string }
>(
  'messages/uploadImageMessage',
  async ({ file, receiverId, receiverType,content: blob }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return rejectWithValue('Token missing');
      const arrayBuffer = await file.arrayBuffer(); // Convertir le fichier en ArrayBuffer
      const formData = new FormData();
      formData.append('file', file);
      const contentType = file.type || 'image/jpeg';

      const response = await fetch(
        `/api/upload-image?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(contentType)}`,
        {
          method: 'POST',
          headers: {
            'Authentication': `Bearer ${token}`,
          },
          body: arrayBuffer,
        }
      );

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const { url } = await response.json();
      const imageUrl = url.split('?')[0];

      const senderId = Number(sessionStorage.getItem('id'));

      const messageResponse = await axios.post(
        '/api/messages',
        {
          receiver_id: receiverId,
          sender_id: senderId,
          content: blob,
          receiver_type: receiverType, // Handle group messages as well
          image_url: imageUrl,
        },
        {
          headers: {
            'Authentication': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return messageResponse.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('An unknown error occurred');
    }
  }
);



const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    list: [],
    listgrp: [],
    loading: false,
    error: null,
  } as MessageState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.list.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.list = action.payload;
    },
    setMessagesGrp: (state, action: PayloadAction<Messagegrp[]>) => {
      state.listgrp = action.payload; // Add messages for groups
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMessagesGrp.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessagesGrp.fulfilled, (state, action) => {
        state.loading = false;
        state.listgrp = action.payload;
      })
      .addCase(fetchMessagesGrp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.list.push(action.payload); // Add new message to list
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(uploadImageMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImageMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); // Add new message with image to list
      })
      .addCase(uploadImageMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addMessage, setMessagesGrp } = messagesSlice.actions;

// Selectors
export const selectMessages = (state: RootState) => state.messages.list;
export const selectMessagesgrp = (state: RootState) => state.messages.listgrp;
export const selectMessagesLoading = (state: RootState) => state.messages.loading;
export const selectMessagesError = (state: RootState) => state.messages.error;

export default messagesSlice.reducer;