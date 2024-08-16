import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './expensesSlice';
import incomeReducer from './incomeSlice';
import usersReducer from './usersSlice';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    income: incomeReducer,
    users: usersReducer,
  }
});
