import { useEffect, useState } from 'react';
import { getWalletBalance, getDailyExpenses } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

const WalletDashboard = () => {
  const [balance, setBalance] = useState(
    Number(localStorage.getItem('balance')) || null
  );
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getWalletBalance()
      .then((data) => {
        localStorage.setItem('balance', data.balance);
        setBalance(data.balance);
      })
      .catch((err) => toast.error(err?.message));

    getDailyExpenses()
      .then((data) => setDailyExpenses(data))
      .catch((err) => toast.error(err?.message));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout Successfully');
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-semibold mb-4">Wallet Balance</h2>

      {balance !== null ? (
        <p className="text-3xl font-bold text-green-600 mb-6">
          ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      ) : (
        <p className="mb-6">Loading...</p>
      )}

      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6" gutterBottom className=" !text-base">
            Day-wise Expense Chart
          </Typography>
          {dailyExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2">No expense data available.</Typography>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded cursor-pointer"
          onClick={() => navigate('/transfer')}
        >
          Fund Transfer
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded cursor-pointer"
          onClick={() => navigate('/transactions')}
        >
          View Transaction History
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded cursor-pointer"
          onClick={() => navigate('/summary')}
        >
          View Daily Summary
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded cursor-pointer"
          onClick={() => navigate('/live-feed')}
        >
          View Live Feed
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded cursor-pointer"
          onClick={() => navigate('/submit-trade')}
        >
          Submit Trade
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded mt-4 cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default WalletDashboard;
