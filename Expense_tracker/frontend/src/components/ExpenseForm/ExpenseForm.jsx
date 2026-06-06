import { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES } from '../../api/expenseApi.js';
import ErrorMessage from '../ErrorMessage/ErrorMessage.jsx';
import styles from './ExpenseForm.module.css';

/**
 * Form for creating or editing an expense. When `initialValue` is supplied
 * it behaves as an edit form. Validation is performed inline and the parent
 * is only called via onSubmit with a clean payload.
 */
export default function ExpenseForm({ initialValue, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    note: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setForm({
        title: initialValue.title || '',
        amount: initialValue.amount ?? '',
        category: initialValue.category || 'Food',
        note: initialValue.note || '',
        date: initialValue.date
          ? new Date(initialValue.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
    }
  }, [initialValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    else if (form.title.trim().length > 120) next.title = 'Title is too long';

    if (form.amount === '' || form.amount === null) next.amount = 'Amount is required';
    else if (Number.isNaN(Number(form.amount))) next.amount = 'Amount must be a number';
    else if (Number(form.amount) <= 0) next.amount = 'Amount must be greater than zero';

    if (!form.category) next.category = 'Category is required';
    if (!form.date) next.date = 'Date is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        note: form.note.trim(),
        date: form.date,
      });
      if (!initialValue) {
        // Reset only when creating, not when editing.
        setForm({
          title: '', amount: '', category: 'Food', note: '',
          date: new Date().toISOString().slice(0, 10),
        });
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={submitError} onDismiss={() => setSubmitError(null)} />

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title" name="title" type="text"
            placeholder="e.g. Lunch at Cafe Verde"
            value={form.title} onChange={handleChange}
            className={errors.title ? styles.invalid : ''}
            maxLength={120}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount" name="amount" type="number"
            step="0.01" min="0.01"
            placeholder="0.00"
            value={form.amount} onChange={handleChange}
            className={errors.amount ? styles.invalid : ''}
          />
          {errors.amount && <span className={styles.errorText}>{errors.amount}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select
            id="category" name="category"
            value={form.category} onChange={handleChange}
            className={errors.category ? styles.invalid : ''}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <span className={styles.errorText}>{errors.category}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="date">Date</label>
          <input
            id="date" name="date" type="date"
            value={form.date} onChange={handleChange}
            className={errors.date ? styles.invalid : ''}
            max={new Date().toISOString().slice(0, 10)}
          />
          {errors.date && <span className={styles.errorText}>{errors.date}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="note">Note (optional)</label>
        <textarea
          id="note" name="note" rows={2}
          placeholder="Anything worth remembering…"
          value={form.note} onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancel} onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true"></span>
              Saving…
            </>
          ) : (
            submitLabel || (initialValue ? 'Update expense' : 'Add expense')
          )}
        </button>
      </div>
    </form>
  );
}
