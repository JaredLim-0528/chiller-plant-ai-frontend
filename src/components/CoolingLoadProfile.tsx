import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Clock } from 'lucide-react';
import type { CoolingLoadDataPoint } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CoolingLoadProfileProps {
  data: CoolingLoadDataPoint[];
}

export const CoolingLoadProfile: React.FC<CoolingLoadProfileProps> = ({ data }) => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:00`;

  const actualData = data.map(d => d.actual || null);
  const forecastData = data.map(d => d.forecast || null);
  
  const chartData = {
    labels: data.map(d => d.time),
    datasets: [
      {
        label: 'Actual Load',
        data: actualData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'rgb(34, 197, 94)',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        spanGaps: false,
      },
      {
        label: 'Forecasted Load',
        data: forecastData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        spanGaps: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'rgb(243, 244, 246)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          title: (context: any) => `Time: ${context[0].label}`,
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y?.toFixed(0)} TR`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Time of Day',
          color: 'rgb(156, 163, 175)',
          font: {
            size: 14
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12
          },
          callback: (value: any) => `${value} TR`
        },
        title: {
          display: true,
          text: 'Cooling Load (TR)',
          color: 'rgb(156, 163, 175)',
          font: {
            size: 14
          }
        }
      }
    }
  };

  const currentActual = actualData.filter(v => v !== null).slice(-1)[0] || 0;
  const nextForecast = forecastData.find(v => v !== null) || 0;
  const peakActual = Math.max(...actualData.filter(v => v !== null));
  const peakForecast = Math.max(...forecastData.filter(v => v !== null));

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
          <h2 className="text-xl font-semibold text-white">
            Today's Cooling Load Profile
          </h2>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>Current Time: {currentTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-4 border border-emerald-700/30">
          <p className="text-sm font-medium text-emerald-300 mb-1">Current Actual</p>
          <p className="text-2xl font-bold text-emerald-400">{currentActual.toFixed(0)} TR</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-4 border border-blue-700/30">
          <p className="text-sm font-medium text-blue-300 mb-1">Next Hour Forecast</p>
          <p className="text-2xl font-bold text-blue-400">{nextForecast.toFixed(0)} TR</p>
        </div>
        <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-lg p-4 border border-amber-700/30">
          <p className="text-sm font-medium text-amber-300 mb-1">Peak Actual</p>
          <p className="text-2xl font-bold text-amber-400">{peakActual.toFixed(0)} TR</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-700/30">
          <p className="text-sm font-medium text-purple-300 mb-1">Peak Forecast</p>
          <p className="text-2xl font-bold text-purple-400">{peakForecast.toFixed(0)} TR</p>
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}; 