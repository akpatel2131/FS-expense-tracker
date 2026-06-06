import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Loader from './components/Loader/Loader.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Expenses from './pages/Expenses/Expenses.jsx';

/**
 * Root component. Decides whether to render the navbar (only when logged in)
 * and defines the route table. While the AuthContext is still rehydrating
 * the user from localStorage, render a full-screen loader to avoid flashing
 * the login page for authenticated users.
 */
export default function App() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <Loader fullscreen label="Loading your workspace…" />;
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
