import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_SOCKET_BASE_URL, {
  transports: ['websocket'],
  reconnection: true,
});

const LiveFeed = () => {
  const [trades, setTrades] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    const onTrade = (trade) => {
      if (!timer.current) {
        timer.current = setTimeout(() => {
          setTrades((prev) => [...trade.reverse(), ...prev].slice(0, 50));
          clearTimeout(timer.current);
          timer.current = null;
        }, 1000);
      }
    };

    socket.on('tradeBatch', onTrade);
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connect_error:', error);
    });

    return () => {
      socket.off('tradeBatch', onTrade);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">📈 Live Trade Feed</h2>

      <div className="grid grid-cols-4 gap-4 font-bold border-b pb-2">
        <span>Instrument</span>
        <span>Price</span>
        <span>Volume</span>
        <span>Time</span>
      </div>

      <ul className="max-h-96 overflow-auto divide-y">
        {trades?.map((t, idx) => (
          <li
            key={idx}
            className="grid grid-cols-4 gap-4 py-2 text-sm items-center"
          >
            <span className="font-medium">{t.instrument}</span>
            <span>₹{parseFloat(t.price).toFixed(2)}</span>
            <span>{t.volume}</span>
            <span className="text-gray-500">
              {new Date(t.createdAt).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>

      {trades.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Waiting for trades…</p>
      )}
    </div>
  );
};

export default LiveFeed;
