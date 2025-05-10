import { Link } from 'react-router-dom';
import { useAuth } from '../services/authService';
import WorkTimeChart from '../components/WorkTimeChart';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.text}>Welcome, {user?.email}!</p>
      <div className={styles.buttonGroup}>
        <Link to="/tracker" className={styles.button}>
          Go to Time Tracker
        </Link>
        {user?.role === 'admin' && (
          <>
            <Link to="/projects" className={styles.button}>
              Manage Projects
            </Link>
            <Link to="/admin-work-time" className={styles.button}>
              Work Time Report
            </Link>
          </>
        )}
      </div>
      <div className={styles.chartContainer}>
        <WorkTimeChart />
      </div>
    </div>
  );
}

export default Dashboard;