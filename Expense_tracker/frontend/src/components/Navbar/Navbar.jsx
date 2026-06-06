import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">
          <span>$</span>
        </div>
        <div>
          <h1 className={styles.title}>Spendly</h1>
          <p className={styles.subtitle}>Track every penny</p>
        </div>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/expenses" className={linkClass}>Expenses</NavLink>
      </nav>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div className={styles.user}>
          <div className={styles.avatar} aria-hidden="true">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className={styles.userName}>{user?.name}</span>
        </div>

        <button type="button" className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
