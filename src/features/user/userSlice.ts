import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../models/User';
import axios from 'axios';
import { UsersState } from '../../models/UserState';


const initialState: UsersState = {
  list: [],  
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Token missing');
      }
      console.log(token);
      const response = await axios.get('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data || []; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk<User, User, { rejectValue: string }>(
  'users/createUser',
  async (newUser, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/register', newUser);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || 'Failed to create user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ token: string; username: string }>) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    clearUser: (state) => {
      state.token = null;
      state.username = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      });

    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create user';
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;