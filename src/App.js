import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, addUser, setSelectedUser } from './redux/usersSlice';
import { setExpenses, addExpense } from './redux/expensesSlice';
import { setIncome, addIncome } from './redux/incomeSlice';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import Dashboard from './components/Dashboard';
import { fetchUsers, fetchExpenses, fetchIncome, addUser as apiAddUser, addTransaction as apiAddTransaction } from './api';

function App() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const selectedUser = useSelector((state) => state.users.selectedUser);
  const [localSelectedUser, setLocalSelectedUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      dispatch(setUsers(users));
    };
    loadUsers();
  }, [dispatch]);

  useEffect(() => {
    if (localSelectedUser) {
      const loadData = async () => {
        const expenses = await fetchExpenses(localSelectedUser.id);
        const income = await fetchIncome(localSelectedUser.id);
        dispatch(setExpenses(expenses));
        dispatch(setIncome(income));
      };
      loadData();
    }
  }, [localSelectedUser, dispatch]);

  const handleAddUser = async () => {
    const name = prompt('Enter user name:');
    if (name) {
      const newUser = await apiAddUser({ name });
      dispatch(addUser(newUser));
    }
  };

  const handleAddTransaction = async (type, data) => {
    if (localSelectedUser) {
      const newTransaction = { ...data, userId: localSelectedUser.id, type };
      await apiAddTransaction(newTransaction);
      if (type === 'expense') {
        dispatch(addExpense(newTransaction));
      } else {
        dispatch(addIncome(newTransaction));
      }
    }
  };

  return (
    <div className="App">
      <h1 className="text-2xl text-center mt-10">Expense Tracker</h1>
      <div className="flex justify-center space-x-10">
        <div>
          <button onClick={handleAddUser} className="bg-blue-500 text-white p-2 rounded">Add User</button>
          <h2 className="text-xl text-center mt-5">Select User</h2>
          <select onChange={(e) => {
            const selected = users.find(user => user.id === e.target.value);
            setLocalSelectedUser(selected);
            dispatch(setSelectedUser(selected));
          }}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        {localSelectedUser && (
          <div>
            <h2 className="text-xl text-center mt-5">Add Expense</h2>
            <ExpenseForm onSubmit={(data) => handleAddTransaction('expense', data)} />
            <ExpenseList />
            <h2 className="text-xl text-center mt-5">Add Income</h2>
            <IncomeForm onSubmit={(data) => handleAddTransaction('income', data)} />
            <IncomeList />
          </div>
        )}
      </div>
      <Dashboard />
    </div>
  );
}

export default App;
