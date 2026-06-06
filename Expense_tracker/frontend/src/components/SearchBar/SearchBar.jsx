import { EXPENSE_CATEGORIES } from '../../api/expenseApi.js';
import styles from './SearchBar.module.css';

/**
 * Combined search input and category filter. Designed as a controlled
 * component — the parent (or context) owns the values.
 */
export default function SearchBar({
  search, onSearchChange,
  category, onCategoryChange,
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Search title or note…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.input}
          aria-label="Search expenses"
        />
        {search && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      <div className={styles.filterWrap}>
        <label htmlFor="categoryFilter" className={styles.filterLabel}>Category</label>
        <select
          id="categoryFilter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={styles.select}
        >
          <option value="All">All</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
