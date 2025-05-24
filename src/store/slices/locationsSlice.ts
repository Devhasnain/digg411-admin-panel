import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface LocationsState {
  locations: any[] | []
}

const initialState: LocationsState = {
  locations: []
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload
    },
    addLocation:(state,action)=>{
      state.locations = [...state.locations,action.payload]
    },
    updateLocation: (state, action) => {
      state.locations = state.locations.map((item) => {
        return item._id === action.payload._id ? { ...action.payload } : item
      })
    },
    deleteLocation: (state, action) => {
      state.locations = state.locations.filter((item) => item._id !== action.payload);
    }
  },
});

export const { setLocations, updateLocation, deleteLocation, addLocation } = locationsSlice.actions;
export const getLocations = (state: RootState) => state.locations.locations;
export default locationsSlice.reducer;
