// src/store/slices/usersSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface State {
  users: any[] | []
}

const initialState: State = {
  users: []
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    addUser:(state,action)=>{
      state.users = [...state.users,action.payload]
    }
  },
});

export const { setUsers, addUser } = usersSlice.actions;
export const getUsers = (state: RootState) => state.users.users;
export default usersSlice.reducer;
