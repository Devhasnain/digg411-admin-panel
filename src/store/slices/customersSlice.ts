// src/store/slices/usersSlice.ts
import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';


interface State {
  customers: any[] | []
}

const initialState: State = {
  customers: []
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload
    },
    removeCustomers:(state,action)=>{
      state.customers = state.customers.filter((item)=>item._id !== action.payload)
    }
  },
});

export const { setCustomers, removeCustomers } = customersSlice.actions;
export const getCustomers = (state: RootState) => state.customers.customers;
export default customersSlice.reducer;
