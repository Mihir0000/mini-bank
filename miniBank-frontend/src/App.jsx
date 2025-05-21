import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import TransferForm from './pages/Transfer';
import SummaryView from './pages/SummaryView';
import TransactionList from './pages/TransactionList';
import LiveFeed from './pages/LiveFeed';
import SubmitTrade from './pages/SubmitTrade';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/transfer"
            element={
              <PrivateRoute>
                <TransferForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <TransactionList />
              </PrivateRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <PrivateRoute>
                <SummaryView />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit-trade"
            element={
              <PrivateRoute>
                <SubmitTrade />
              </PrivateRoute>
            }
          />

          <Route path="/live-feed" element={<LiveFeed />} />

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
