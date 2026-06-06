import styles from './ExpenseTable.module.css';

const CATEGORY_COLORS = {
  Food:          '#10b981',
  Transport:     '#3b82f6',
  Shopping:      '#ec4899',
  Bills:         '#f59e0b',
  Entertainment: '#8b5cf6',
  Health:        '#ef4444',
  Education:     '#06b6d4',
  Travel:        '#14b8a6',
  Other:         '#64748b',
};

const fmtCurrency = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

/**
 * Displays a list of expenses. Falls back to an aesthetic empty state.
 * Edit / delete actions are surfaced as icon buttons; on small screens the
 * table collapses to stacked cards.
 */
export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path d="M3 10h18M8 4v4M16 4v4" />
          </svg>
        </div>
        <h4>No expenses yet</h4>
        <p>Add your first expense to start tracking where your money goes.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th className={styles.alignRight}>Amount</th>
            <th className={styles.alignRight}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, idx) => (
            <tr key={exp._id} style={{ animationDelay: `${idx * 30}ms` }} className={styles.row}>
              <td>
                <div className={styles.titleCell}>
                  <span className={styles.title}>{exp.title}</span>
                  {exp.note && <span className={styles.note}>{exp.note}</span>}
                </div>
              </td>
              <td>
                <span
                  className={styles.badge}
                  style={{
                    color: CATEGORY_COLORS[exp.category] || '#64748b',
                    background: `${CATEGORY_COLORS[exp.category] || '#64748b'}1f`,
                  }}
                >
                  {exp.category}
                </span>
              </td>
              <td className={styles.muted}>{fmtDate(exp.date)}</td>
              <td className={`${styles.alignRight} ${styles.amount}`}>{fmtCurrency(exp.amount)}</td>
              <td className={styles.alignRight}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => onEdit?.(exp)}
                    className={`${styles.iconBtn} ${styles.editBtn}`}
                    aria-label={`Edit ${exp.title}`}
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(exp)}
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    aria-label={`Delete ${exp.title}`}
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
