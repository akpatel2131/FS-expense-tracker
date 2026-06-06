import axios from 'axios';

/**
 * Shared axios instance. Requests are sent to the dev server which proxies
 * /api to the backend (see vite.config.js).
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Attach the JWT (when present) to every outgoing request. The token is
 * managed by AuthContext and mirrored into localStorage so it survives
 * reloads.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('et_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Normalize error shape so consumers can simply read `err.message`. If the
 * token has expired we wipe local state and let the next render redirect to
 * /login.
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message =
      err.response?.data?.message || err.message || 'Unexpected network error';

    if (status === 401) {
      localStorage.removeItem('et_token');
      localStorage.removeItem('et_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
