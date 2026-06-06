import { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext.jsx';
import ExpenseForm from '../../components/ExpenseForm/ExpenseForm.jsx';
import ExpenseTable from '../../components/ExpenseTable/ExpenseTable.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx';
import styles from './Expenses.module.css';

const fmtCurrency = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);

export default function Expenses() {
  const {
    expenses, loading, error, clearError,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    addExpense, updateExpense, deleteExpense,
  } = useExpenses();

  const [editing, setEditing] = useState(null);   // expense being edited
  const [deleteTarget, setDeleteTarget] = useState(null); // confirm modal target

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateExpense(editing._id, payload);
      setEditing(null);
    } else {
      await addExpense(payload);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExpense(deleteTarget._id);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <main className={`${styles.page} page-enter`}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Expenses</h2>
          <p className={styles.sub}>Add, edit, search and filter every transaction.</p>
        </div>
        <div className={styles.summary}>
          <span className={styles.summaryLabel}>Filtered total</span>
          <span className={styles.summaryValue}>{fmtCurrency(total)}</span>
        </div>
      </header>

      <ErrorMessage message={error} onDismiss={clearError} />

      <div className={styles.grid}>
        <section className={styles.formCard}>
          <header className={styles.cardHead}>
            <h3>{editing ? 'Edit expense' : 'Add a new expense'}</h3>
            {editing && (
              <span className={styles.editingPill}>Editing #{editing._id.slice(-5)}</span>
            )}
          </header>
          <ExpenseForm
            initialValue={editing}
            onSubmit={handleSubmit}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
        </section>

        <section className={styles.listCard}>
          <header className={styles.cardHead}>
            <h3>All transactions</h3>
            <span className={styles.count}>{expenses.length} entries</span>
          </header>

          <SearchBar
            search={search}
            onSearchChange={setSearch}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />

          {loading ? (
            <Loader label="Loading expenses…" />
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={(exp) => {
                setEditing(exp);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={(exp) => setDeleteTarget(exp)}
            />
          )}
        </section>
      </div>

      {deleteTarget && (
        <div className={styles.modalBackdrop} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.modalIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </div>
            <h4>Delete this expense?</h4>
            <p>
              "<strong>{deleteTarget.title}</strong>" ({fmtCurrency(deleteTarget.amount)}) will be permanently removed.
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button type="button" className={styles.deleteBtn} onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
