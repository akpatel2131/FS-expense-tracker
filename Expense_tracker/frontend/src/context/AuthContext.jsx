import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/expenseApi.js';

/**
 * Holds the current user + JWT. Rehydrates from localStorage on first mount
 * and validates the cached token by calling /auth/me so a stale token doesn't
 * leave the UI in a broken state.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On boot: try the cached token. If it's invalid, clear everything.
  useEffect(() => {
    const token = localStorage.getItem('et_token');
    const cachedUser = localStorage.getItem('et_user');

    if (!token) {
      setInitializing(false);
      return;
    }

    if (cachedUser) {
      try { setUser(JSON.parse(cachedUser)); } catch { /* ignore */ }
    }

    authApi
      .me()
      .then((fresh) => {
        setUser(fresh);
        localStorage.setItem('et_user', JSON.stringify(fresh));
      })
      .catch(() => {
        localStorage.removeItem('et_token');
        localStorage.removeItem('et_user');
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  const persist = (data) => {
    const { token, ...rest } = data;
    localStorage.setItem('et_token', token);
    localStorage.setItem('et_user', JSON.stringify(rest));
    setUser(rest);
  };

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    persist(data);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password });
    persist(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('et_token');
    localStorage.removeItem('et_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
