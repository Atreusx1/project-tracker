import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './services/authService';
import Login from './pages/Login';
import Register from './pages/Register';
import ConfirmEmail from './pages/ConfirmEmail';
import Dashboard from './pages/Dashboard';
import TimeTrackerPage from './pages/TimeTrackerPage';
import Projects from './pages/Projects';
import AdminWorkTimeChart from './pages/AdminWorkTimeChart';
import styles from './App.module.css';

function App() {
  const { user, isAuthenticated, logout, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.app}>
      {isAuthenticated && (
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <h1 className={styles.navTitle}>Time Tracker</h1>
            <div className={styles.navLinks}>
              <Link to="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <Link to="/tracker" className={styles.navLink}>
                Tracker
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link to="/projects" className={styles.navLink}>
                    Projects
                  </Link>
                  <Link to="/admin-work-time" className={styles.navLink}>
                    Work Time Report
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className={styles.navButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/confirm-email/:token" element={<ConfirmEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tracker" element={<TimeTrackerPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin-work-time" element={<AdminWorkTimeChart />} />
        <Route path="/" element={<Login />} /> {/* Changed default route to /login */}
      </Routes>
    </div>
  );
}

export default App;