import { useEffect, useState } from 'react';
import { getWalletBalance } from '../api';
import { useNavigate } from 'react-router-dom';

const WalletDashboard = () => {
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getWalletBalance()
      .then((data) => setBalance(data.balance))
      .catch((err) => alert(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-semibold mb-4">Wallet Balance</h2>

      {balance !== null ? (
        <p className="text-3xl font-bold text-green-600 mb-6">
          ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      ) : (
        <p className="mb-6">Loading...</p>
      )}

      <div className="flex flex-col gap-4">
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
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded cursor-pointer mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default WalletDashboard;
