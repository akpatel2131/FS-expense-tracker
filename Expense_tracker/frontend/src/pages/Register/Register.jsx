import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx';
import styles from './Register.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    else if (form.name.trim().length < 2) next.name = 'Name is too short';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Min 6 characters';
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate('/');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}><span>$</span></div>
          <h1>Spendly</h1>
        </div>
        <p className={styles.tag}>Create your account and take control of your money.</p>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <ErrorMessage message={submitError} onDismiss={() => setSubmitError(null)} />

          <div className={styles.field}>
            <label htmlFor="name">Full name</label>
            <input
              id="name" name="name" type="text" autoComplete="name"
              placeholder="Jane Doe"
              value={form.name} onChange={handleChange}
              className={errors.name ? styles.invalid : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" autoComplete="email"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              className={errors.email ? styles.invalid : ''}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password" autoComplete="new-password"
                placeholder="••••••••"
                value={form.password} onChange={handleChange}
                className={errors.password ? styles.invalid : ''}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="confirm">Confirm</label>
              <input
                id="confirm" name="confirm" type="password" autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirm} onChange={handleChange}
                className={errors.confirm ? styles.invalid : ''}
              />
              {errors.confirm && <span className={styles.errorText}>{errors.confirm}</span>}
            </div>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Creating account…
              </>
            ) : 'Create account'}
          </button>
        </form>

        <p className={styles.swap}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
