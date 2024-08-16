import React, { useState } from 'react';

const ExpenseForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, amount: parseFloat(amount) });
    setName('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-5">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
