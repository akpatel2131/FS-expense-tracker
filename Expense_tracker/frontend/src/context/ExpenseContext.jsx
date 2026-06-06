import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { expenseApi } from '../api/expenseApi.js';
import { useAuth } from './AuthContext.jsx';

/**
 * Owns the expense list + dashboard stats, plus the search/filter state.
 * Every mutation triggers a stats refresh so the dashboard stays in sync.
 */
const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  /* ---------------- fetchers ---------------- */

  const fetchExpenses = useCallback(
    async (params) => {
      setLoading(true);
      setError(null);
      try {
        const data = await expenseApi.list({
          q: params?.q ?? search,
          category: params?.category ?? categoryFilter,
        });
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [search, categoryFilter]
  );

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await expenseApi.stats();
      setStats(data);
    } catch (err) {
      // Stats failure shouldn't blow up the whole UI — surface via error state.
      setError(err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Reload list when search / filter / user changes.
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setStats(null);
      return;
    }
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search, categoryFilter]);

  // Load stats whenever user changes.
  useEffect(() => {
    if (user) fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ---------------- mutations ---------------- */

  const addExpense = useCallback(async (payload) => {
    const created = await expenseApi.create(payload);
    setExpenses((prev) => [created, ...prev]);
    fetchStats();
    return created;
  }, [fetchStats]);

  const updateExpense = useCallback(async (id, payload) => {
    const updated = await expenseApi.update(id, payload);
    setExpenses((prev) => prev.map((e) => (e._id === id ? updated : e)));
    fetchStats();
    return updated;
  }, [fetchStats]);

  const deleteExpense = useCallback(async (id) => {
    await expenseApi.remove(id);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    fetchStats();
  }, [fetchStats]);

  const value = useMemo(
    () => ({
      expenses, stats,
      loading, statsLoading, error,
      search, setSearch,
      categoryFilter, setCategoryFilter,
      fetchExpenses, fetchStats,
      addExpense, updateExpense, deleteExpense,
      clearError: () => setError(null),
    }),
    [
      expenses, stats, loading, statsLoading, error,
      search, categoryFilter,
      fetchExpenses, fetchStats,
      addExpense, updateExpense, deleteExpense,
    ]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider');
  return ctx;
};
