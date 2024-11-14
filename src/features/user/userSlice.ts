import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {UserState} from "../../models/UserState";

  
const initialState: UserState = {
  token: null,
  username: null,
};

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
      sessionStorage.removeItem("sessionToken");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;