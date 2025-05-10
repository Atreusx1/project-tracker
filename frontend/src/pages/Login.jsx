import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import styles from './Login.module.css';

function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <LoginForm />
        <p className={styles.text}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;