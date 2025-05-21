const API_BASE = import.meta.env.VITE_API_BASE_URL;

const request = async (endpoint, { method = 'GET', body, token } = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = token || localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
};

// Auth
export const authLogin = (form) =>
  request('/auth/login', { method: 'POST', body: form });
export const authRegistration = (form) =>
  request('/auth/register', { method: 'POST', body: form });

// Wallet
export const getWalletBalance = () => request('/wallet');

// Transactions
export const fetchTransactions = () => request('/transactions');
export const fetchSummaryByDate = (date) =>
  request(`/transactions/summary/${date}`);
