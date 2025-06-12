import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import exampleReducer from './slices/exampleSlice';
import authSlice from './slices/authSlice';
import usersSlice from './slices/usersSlice';
import faqSlice from './slices/faqSlice';
import pageSlice from './slices/pageSlice';
import locationsSlice from './slices/locationsSlice';
import contactSlice from './slices/contactSlice';
import newsLettersSlice from './slices/newsLettersSlice';
import dashboardSlice from './slices/dashboardSlice';
import mineralsSlice from './slices/mineralsSlice';


const rootReducer = combineReducers({
  example: exampleReducer,
  auth: authSlice,
  users: usersSlice,
  faq: faqSlice,
  page: pageSlice,
  locations: locationsSlice,
  contacts:contactSlice,
  newsletters:newsLettersSlice,
  dashboard:dashboardSlice,
  minerals:mineralsSlice
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
