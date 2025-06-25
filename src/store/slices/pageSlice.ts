// src/store/slices/pagesSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface PageState {
  pages:any[] | []
}

const initialState: PageState = {
  pages:[]
};

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
   setPage:(state,action)=>{
    state.pages = [...state.pages,action.payload];
   },
   updatePage:(state,action)=>{
    console.log(action.payload)
    state.pages.map((item)=>{
      if(item._id === action.payload._id){
        return action.payload
      }else return item
    })
   }
  },
});

export const { setPage, updatePage } = pagesSlice.actions;
export const getPages = (state:RootState)=>state.page.pages
export default pagesSlice.reducer;
