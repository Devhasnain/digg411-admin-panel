import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface PlanState {
  plans: any[] | []
}

const initialState: PlanState = {
  plans: []
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload
    },
    addPlan:(state,action)=>{
      state.plans = [...state.plans,action.payload]
    },
    updatePlan: (state, action) => {
      state.plans = state.plans.map((item) => {
        return item._id === action.payload._id ? { ...action.payload } : item
      })
    },
    deletePlan: (state, action) => {
      state.plans = state.plans.filter((item) => item._id !== action.payload);
    }
  },
});

export const { setPlans, addPlan, updatePlan, deletePlan } = planSlice.actions;
export const getPlans = (state: RootState) => state.plan.plans;
export default planSlice.reducer;
