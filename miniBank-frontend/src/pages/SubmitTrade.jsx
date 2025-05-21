import { useState } from 'react';

const SubmitTrade = () => {
  const [form, setForm] = useState({
    instrument: '',
    price: '',
    volume: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          volume: parseInt(form.volume),
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus('success');
      setForm({ instrument: '', price: '', volume: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">🚀 Submit New Trade</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="instrument"
          placeholder="Instrument (e.g., BTC/INR)"
          value={form.instrument}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (e.g., 23400.50)"
          value={form.price}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          type="number"
          name="volume"
          placeholder="Volume (e.g., 3)"
          value={form.volume}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Trade'}
        </button>
      </form>

      {status === 'success' && (
        <p className="mt-3 text-green-600">Trade submitted successfully!</p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-red-600">Something went wrong.</p>
      )}
    </div>
  );
};

export default SubmitTrade;
