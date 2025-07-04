import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
  ChartOptions,
  ChartData,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";

// Register required Chart.js components and the zoom plugin
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, ChartLegend, zoomPlugin);

interface TimeSeriesPoint {
  time: number | string;
  value: number;
}

interface TimeSeriesPlotProps {
  data: TimeSeriesPoint[];
  label?: string;
  height?: number;
}

const TimeSeriesPlot: React.FC<TimeSeriesPlotProps> = ({
  data,
  label = "Value",
  height = 300,
}) => {
  const chartData: ChartData<"line"> = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label,
        data: data.map((d) => d.value),
        borderColor: "#8884d8",
        backgroundColor: "#8884d8",
        fill: false,
        tension: 0.0,
        spanGaps: false,
        pointRadius: 0,
      },
    ],
  };

  // Memoize options to prevent zoom reset on every render
  const options: ChartOptions<"line"> = useMemo(() => ({
    responsive: true,
    animation: false,
    plugins: {
      legend: { display: true },
      title: { display: true },
      tooltip: { enabled: true },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
          speed: 1, // Increase this value to make panning slower (default is 20)
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        type: "linear",
        ticks: { font: { size: 12 } },
      },
      y: {
        title: { display: true, text: label },
        ticks: {
          font: { size: 12 },
          callback: function (value) {
            return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
          },
        },
      },
    },
  }), [label]); // Only re-create if label changes

  return (
    <div style={{ width: "100%", height }}>
      <Line data={chartData} options={options} height={height} />
      <div style={{fontSize:12, color:"#888", marginTop:4}}>
        <b>Tip:</b> Drag to pan, scroll to zoom, double-click to reset.
      </div>
    </div>
  );
};

export default TimeSeriesPlot;
