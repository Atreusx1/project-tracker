import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useWorkSessions } from '../services/workSessionService';
import styles from './WorkTimeChart.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function WorkTimeChart() {
  const [chartData, setChartData] = useState(null);
  const { fetchUserWorkTimeByDay } = useWorkSessions();

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchUserWorkTimeByDay();
        const labels = data.map((item) => item.date);
        const hours = data.map((item) => item.totalHours);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Hours Worked',
              data: hours,
              backgroundColor: 'rgba(79, 70, 229, 0.5)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Failed to load chart data:', error);
      }
    };

    loadChartData();
  }, []);

  if (!chartData) {
    return <div className={styles.loading}>Loading chart...</div>;
  }

  return (
    <div className={styles.chart}>
      <h3 className={styles.title}>Your Work Time by Day</h3>
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
              text: 'Daily Work Hours',
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
  );
}

export default WorkTimeChart;