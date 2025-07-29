import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';


interface DashboardState {
  analytics: {
    totalUsers: number,
    totalCustomers: number,
    totalSubscriptions: {
      month: number,
      totalAmount: number
    }[] | []
  }
}

const initialState: DashboardState = {
  analytics: {
    totalUsers: 0,
    totalCustomers: 0,
    totalSubscriptions: []
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setAnalytics: (state, action) => {
      state.analytics = action.payload
    },
  },
});

export const { setAnalytics } = dashboardSlice.actions;
export const getDashboardAnalytics = (state: RootState) => state.dashboard.analytics;
export default dashboardSlice.reducer;
