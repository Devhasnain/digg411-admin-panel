import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface ContactState {
  contacts: any[] | []
}

const initialState: ContactState = {
  contacts: []
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action) => {
      state.contacts = action.payload
    },
    addContact:(state,action)=>{
      state.contacts = [...state.contacts,action.payload]
    },
    updateContact: (state, action) => {
      state.contacts = state.contacts.map((item) => {
        return item._id === action.payload._id ? { ...action.payload } : item
      })
    },
    deleteContact: (state, action) => {
      state.contacts = state.contacts.filter((item) => item._id !== action.payload);
    }
  },
});

export const { setContacts, updateContact, deleteContact, addContact } = contactSlice.actions;
export const getContacts = (state: RootState) => state.contacts.contacts;
export default contactSlice.reducer;
