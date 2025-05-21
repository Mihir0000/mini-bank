import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TransferForm = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const idempotencyKey = uuidv4();

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        toUserEmail: email,
        amount: Number(amount),
        idempotencyKey,
      }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Transfer Funds</h2>
      <form onSubmit={handleTransfer} className="space-y-4">
        <input
          type="email"
          placeholder="Recipient Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
      {message && <p className="mt-4 text-center font-medium">{message}</p>}
    </div>
  );
};

export default TransferForm;
