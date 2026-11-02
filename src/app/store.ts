import { configureStore, combineReducers } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import { borrowLimitMiddleware } from './middleware/borrowLimitMiddleware';

const rootReducer = combineReducers({
  books: booksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(borrowLimitMiddleware),
});

export type AppDispatch = typeof store.dispatch;
