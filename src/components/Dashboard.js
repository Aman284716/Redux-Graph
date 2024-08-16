import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, Filler } from 'chart.js';
import { getMonthlyData } from '../utils/dateUtils';

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
);

const Dashboard = () => {
  const { income, expenses } = useSelector((state) => ({
    income: state.income.income,
    expenses: state.expenses.expenses,
  }));
  const selectedUser = useSelector((state) => state.users.selectedUser);

  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [months, setMonths] = useState([]);

  const { monthlyIncome, monthlyExpenses } = getMonthlyData(income, expenses, selectedUser);

  useEffect(() => {
    if (selectedUser) {
      const availableMonths = [...new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpenses)])];
      setMonths(availableMonths);

      if (!availableMonths.includes(selectedMonth)) {
        setSelectedMonth(availableMonths[0] || new Date().toLocaleString('default', { month: 'long' }));
      }
    }
  }, [selectedUser, income, expenses, selectedMonth]);

  const filteredIncome = monthlyIncome[selectedMonth] || 0;
  const filteredExpenses = monthlyExpenses[selectedMonth] || 0;

  // Calculate total income and expenses based on selected user
  const totalIncome = Object.values(monthlyIncome).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);

  // Bar chart data
  const barData = {
    labels: [selectedMonth],
    datasets: [
      {
        label: 'Income',
        data: [filteredIncome],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expenses',
        data: [filteredExpenses],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Pie chart data
  const pieData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        hoverBackgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
      },
    ],
  };

  // Line chart data
  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(month => monthlyIncome[month] || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: months.map(month => monthlyExpenses[month] || 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      <h2 className="text-xl text-center mb-5">Monthly Income & Expenses</h2>
      <div className="flex justify-between mb-5">
        <div>
          <label className="mr-2">Month:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Total Income:</label>
          <span>${totalIncome.toFixed(2)}</span>
        </div>
        <div>
          <label className="mr-2">Total Expenses:</label>
          <span>${totalExpenses.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex-1 min-w-[300px]">
          <h3 className="text-lg text-center mb-3">Bar Chart</h3>
          <Bar data={barData} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <h3 className="text-lg text-center mb-3">Pie Chart</h3>
          <Pie data={pieData} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <h3 className="text-lg text-center mb-3">Line Chart</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
