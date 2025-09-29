import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';

import newsLettersSlice from './slices/newsLettersSlice';
import locationsSlice from './slices/locationsSlice';
import dashboardSlice from './slices/dashboardSlice';
import customersSlice from './slices/customersSlice';
import mineralsSlice from './slices/mineralsSlice';
import exampleReducer from './slices/exampleSlice';
import contactSlice from './slices/contactSlice';
import usersSlice from './slices/usersSlice';
import planSlice from './slices/planSlice';
import pageSlice from './slices/pageSlice';
import authSlice from './slices/authSlice';
import faqSlice from './slices/faqSlice';


const rootReducer = combineReducers({
  example: exampleReducer,
  auth: authSlice,
  users: usersSlice,
  faq: faqSlice,
  page: pageSlice,
  locations: locationsSlice,
  contacts: contactSlice,
  newsletters: newsLettersSlice,
  dashboard: dashboardSlice,
  minerals: mineralsSlice,
  plan: planSlice,
  customers: customersSlice
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'users']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
