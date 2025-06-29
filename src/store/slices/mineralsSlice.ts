// src/store/slices/usersSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface MineralState {
  minerals: any[] | []
}

const initialState: MineralState = {
  minerals: []
};

const mineralsSlice = createSlice({
  name: 'minerals',
  initialState,
  reducers: {
    setMinerals: (state, action) => {
      state.minerals = action.payload
    },
    addMineral:(state,action)=>{
      state.minerals = [action.payload,...state.minerals]
    },
    updateMineral:(state,action)=>{
      state.minerals = state?.minerals?.map((item)=>{
        if(item?._id === action.payload){
          return action.payload
        }else{
          return item
        }
      })
    },
    removeMineral:(state,action)=>{
      state.minerals = state.minerals.filter((item)=>item._id !== action.payload)
    }
  },
});

export const { setMinerals, addMineral, removeMineral, updateMineral } = mineralsSlice.actions;
export const getMineralsList = (state: RootState) => state.minerals.minerals;
export default mineralsSlice.reducer;
