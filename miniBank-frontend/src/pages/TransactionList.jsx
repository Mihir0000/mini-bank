import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../api';
import { toast } from 'sonner';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions()
      .then((data) => setTransactions(data))
      .catch((err) => toast.error(err?.message));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li key={tx._id} className="bg-white shadow p-4 rounded">
              <p>
                <strong>From:</strong> {tx.from?.email || 'N/A'}
              </p>
              <p>
                <strong>To:</strong> {tx.to?.email || 'N/A'}
              </p>
              <p>
                <strong>Amount:</strong> ₹{tx.amount}
              </p>
              <p>
                <strong>Date:</strong> {new Date(tx.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionList;
