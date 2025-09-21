import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function TemperatureChart({ hourlyData }) {
  if (!hourlyData || !hourlyData.length) return <p>Loading chart...</p>;

  // Find the index of the first "12:00 am"
  const startIndex = hourlyData.findIndex(item => item.time.toLowerCase() === "12:00 am");

  // If not found, fallback to start from index 0
  const todayData = hourlyData.slice(startIndex >= 0 ? startIndex : 0, (startIndex >= 0 ? startIndex : 0) + 24);

  const times = todayData.map(item => item.time);
  const temps = todayData.map(item => item.temperature);

  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  return (
    <div className="rounded-lg w-full h-50 mx-auto">
      <LineChart
        xAxis={[{
          data: times,
        scaleType: 'point',
        tickLabelInterval: (i) => i % 3 === 0, // show every 3rd label
      }]}
     yAxis={[{
  ticks: [20, 22, 24, 26, 28],  // fixed tick labels
}]}


      series={[{
        data: temps,
        label: 'Temperature (°C)',
        color: '#ff7043',
        showMark: false,
      }]}
      height={200}
      width={undefined}
     
    />  
     </div>
  );    
}
