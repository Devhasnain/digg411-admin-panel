// src/store/slices/exampleSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface AuthState {
  user: any | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    updateUser:(state,action)=>{
      state.user = {
        ...state.user,
        ...action.payload
      }
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    resetAuth:(state)=>{
      state.token = null;
      state.user = null
    }
  },
});

export const { setUser, setToken,resetAuth, updateUser } = authSlice.actions;
export const getUser = (state:RootState) => state.auth.user;
export const getToken = (state:RootState) => state.auth.token;
export default authSlice.reducer;
