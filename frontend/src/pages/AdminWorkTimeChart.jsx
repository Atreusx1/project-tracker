import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useWorkSessions } from '../services/workSessionService';
import styles from './AdminWorkTimeChart.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminWorkTimeChart() {
  const [chartData, setChartData] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [elapsedTimes, setElapsedTimes] = useState({});
  const { fetchAllUsersWorkTimeByDay, fetchUsers, fetchAllActiveSessions, fetchAllSessions } = useWorkSessions();

  useEffect(() => {
    const loadUsersAndSessions = async () => {
      try {
        const userList = await fetchUsers();
        setUsers(userList);
        setSelectedUsers(userList.map((user) => user._id));

        const activeSessionsData = await fetchAllActiveSessions();
        setActiveSessions(activeSessionsData);

        const allSessionsData = await fetchAllSessions();
        setAllSessions(allSessionsData);
      } catch (error) {
        console.error('Failed to load users or sessions:', error);
      }
    };
    loadUsersAndSessions();
  }, []);

  // Update elapsed times for active sessions
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTimes((prev) => {
        const newTimes = { ...prev };
        activeSessions.forEach((session) => {
          if (session.user && session.project) {
            const startTime = new Date(session.startTime).getTime();
            const currentTime = Date.now();
            const secondsElapsed = Math.floor((currentTime - startTime) / 1000);
            newTimes[session._id] = secondsElapsed;
          }
        });
        return newTimes;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSessions]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchAllUsersWorkTimeByDay(selectedUsers);
        const uniqueDates = [...new Set(data.map((item) => item.date))].sort();
        const datasets = users
          .filter((user) => selectedUsers.includes(user._id))
          .map((user) => {
            const userData = uniqueDates.map((date) => {
              const entry = data.find(
                (item) => item.date === date && item.userId === user._id
              );
              return entry ? entry.totalHours : 0;
            });
            return {
              label: user.email,
              data: userData,
              backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
              borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
              borderWidth: 1,
            };
          });

        setChartData({
          labels: uniqueDates,
          datasets,
        });
      } catch (error) {
        console.error('Failed to load chart data:', error);
      }
    };

    loadChartData();
  }, [selectedUsers, users]);

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Format elapsed time as HH:MM:SS
  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format duration in hours
  const formatDuration = (session) => {
    if (!session.endTime) return 'Ongoing';
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    return `${hours.toFixed(2)} hours`;
  };

  if (!chartData) {
    return <div className={styles.loading}>Loading chart...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Work Time Report (Admin)</h1>

      {/* Active Sessions Section */}
      <div className={styles.activeSessions}>
        <h3 className={styles.activeSessionsTitle}>Current Active Sessions</h3>
        {activeSessions.length === 0 ? (
          <p className={styles.noData}>No active sessions.</p>
        ) : (
          <ul className={styles.sessionList}>
            {activeSessions.map((session) => (
              session.user && session.project ? (
                <li key={session._id} className={styles.sessionItem}>
                  <div className={styles.sessionDetails}>
                    <span className={styles.sessionUser}>
                      <strong>{session.user.email}</strong>
                    </span>
                    <span> is working on </span>
                    <span className={styles.sessionProject}>
                      <strong>{session.project.name}</strong>
                    </span>
                    <span>: {session.description || 'No description'}</span>
                  </div>
                  <div className={styles.sessionTime}>
                    Elapsed: {formatElapsedTime(elapsedTimes[session._id] || 0)}
                  </div>
                </li>
              ) : null
            ))}
          </ul>
        )}
      </div>

      {/* User Filter Section */}
      <div className={styles.filter}>
        <h3 className={styles.filterTitle}>Filter by Users</h3>
        <div className={styles.userList}>
          {users.map((user) => (
            <label key={user._id} className={styles.userItem}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserToggle(user._id)}
              />
              <span>{user.email}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className={styles.chart}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Daily Work Hours by User',
                font: { size: 20 },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Hours',
                  font: { size: 16 },
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Date',
                  font: { size: 16 },
                },
              },
            },
          }}
        />
      </div>

      {/* Session History Section */}
      <div className={styles.history}>
        <h3 className={styles.historyTitle}>Work Session History</h3>
        {allSessions.length === 0 ? (
          <p className={styles.noData}>No sessions recorded.</p>
        ) : (
          <div className={styles.historyTable}>
            <div className={styles.tableHeader}>
              <span>Date</span>
              <span>User</span>
              <span>Project</span>
              <span>Duration</span>
              <span>Description</span>
            </div>
            {allSessions.map((session) => (
              session.user && session.project ? (
                <div key={session._id} className={styles.tableRow}>
                  <span data-label="Date">{new Date(session.startTime).toLocaleDateString()}</span>
                  <span data-label="User">{session.user.email}</span>
                  <span data-label="Project">{session.project.name}</span>
                  <span data-label="Duration">{formatDuration(session)}</span>
                  <span data-label="Description">{session.description || 'No description'}</span>
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminWorkTimeChart;