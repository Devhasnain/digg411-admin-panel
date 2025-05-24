import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface NewsLetterState {
  newsletters: any[] | []
}

const initialState: NewsLetterState = {
  newsletters: []
};

const newsLettersSlice = createSlice({
  name: 'newsletters',
  initialState,
  reducers: {
     setNewsLetters: (state, action) => {
      state.newsletters = action.payload
    },
    deleteNewsLetter: (state, action) => {
      state.newsletters = state.newsletters.filter((item) => item._id !== action.payload);
    }
  },
});

export const { deleteNewsLetter, setNewsLetters } = newsLettersSlice.actions;
export const getNewsLetters = (state: RootState) => state.newsletters.newsletters;
export default newsLettersSlice.reducer;
