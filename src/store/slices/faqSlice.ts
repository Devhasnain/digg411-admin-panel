import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface FaqState {
  faqs: any[] | []
}

const initialState: FaqState = {
  faqs: []
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    setFaqs: (state, action) => {
      state.faqs = action.payload
    },
    addFaq:(state,action)=>{
      state.faqs = [...state.faqs,action.payload]
    },
    updateFaq: (state, action) => {
      state.faqs = state.faqs.map((item) => {
        return item._id === action.payload._id ? { ...action.payload } : item
      })
    },
    deleteFaq: (state, action) => {
      state.faqs = state.faqs.filter((item) => item._id !== action.payload);
    }
  },
});

export const { setFaqs, updateFaq, deleteFaq, addFaq } = faqSlice.actions;
export const getFaqs = (state: RootState) => state.faq.faqs;
export default faqSlice.reducer;
