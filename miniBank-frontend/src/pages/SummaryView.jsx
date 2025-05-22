import React, { useState } from 'react';
import { fetchSummaryByDate } from '../api';
import { toast } from 'sonner';

const SummaryView = () => {
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState(null);

  const handleFetch = async () => {
    try {
      if (!date) throw new Error('Please select date');
      const data = await fetchSummaryByDate(date);
      setSummary(data);
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={handleFetch}
          >
            Get Summary
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          <p>
            <strong>Date:</strong> {summary?.date || '---'}
          </p>
          <p>
            <strong>Total Sent:</strong> ₹{summary?.totalSent || 0}
          </p>
          <p>
            <strong>Total Received:</strong> ₹{summary?.totalReceived || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
