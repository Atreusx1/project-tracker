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
  const { fetchAllUsersWorkTimeByDay, fetchUsers } = useWorkSessions();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await fetchUsers();
        setUsers(userList);
        // Set all user IDs as selected by default
        setSelectedUsers(userList.map((user) => user._id));
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchAllUsersWorkTimeByDay(selectedUsers);
        const uniqueDates = [...new Set(data.map((item) => item.date))].sort();
        const datasets = users
          .filter((user) => selectedUsers.includes(user._id)) // Only include selected users
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

  if (!chartData) {
    return <div className={styles.loading}>Loading chart...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Work Time Report (Admin)</h1>
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
              {user.email}
            </label>
          ))}
        </div>
      </div>
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
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Hours',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default AdminWorkTimeChart;