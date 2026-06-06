import api from './axios.js';

/**
 * Thin wrapper around the /api/expenses endpoints. Keeps API surface in one
 * place so components don't reach into axios directly.
 */
export const expenseApi = {
  list: async (params = {}) => {
    const { data } = await api.get('/expenses', { params });
    return data;
  },
  stats: async () => {
    const { data } = await api.get('/expenses/stats');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/expenses', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/expenses/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/expenses/${id}`);
    return data;
  },
};

export const authApi = {
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Other',
];
