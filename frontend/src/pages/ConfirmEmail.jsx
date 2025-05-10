import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../services/authService';
import styles from './ConfirmEmail.module.css';

function ConfirmEmail() {
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const { token } = useParams();
  const { confirmEmail } = useAuth();

  useEffect(() => {
    if (token !== 'pending') {
      confirmEmail(token)
        .then(() => setStatus('success'))
        .catch((err) => {
          setStatus('error');
          setError(err.response?.data?.message || 'Failed to confirm email');
        });
    }
  }, [token]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Confirm Email</h1>
        {status === 'pending' && (
          <p className={styles.text}>
            Please check your email for a confirmation link.
          </p>
        )}
        {status === 'success' && (
          <p className={styles.success}>
            Email confirmed successfully!{' '}
            <Link to="/login" className={styles.link}>
              Login
            </Link>
          </p>
        )}
        {status === 'error' && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default ConfirmEmail;