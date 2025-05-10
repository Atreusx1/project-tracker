import TimeTracker from '../components/TimeTracker';
import styles from './TimeTrackerPage.module.css';

function TimeTrackerPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Time Tracker</h1>
      <TimeTracker />
    </div>
  );
}

export default TimeTrackerPage;