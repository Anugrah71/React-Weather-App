import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TemperatureChart = ({ hourlyData }) => {
  const labels = hourlyData.map(item => item.time);
  const data = hourlyData.map(item => item.temperature);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Precipitation',
        data: data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: 'Hourly Temperature'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default TemperatureChart;
