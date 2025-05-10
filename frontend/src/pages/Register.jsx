import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import styles from './Register.module.css';

function Register() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>
        <RegisterForm />
        <p className={styles.text}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;