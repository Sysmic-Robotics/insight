// src/components/TimeSeriesPlot.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface TimeSeriesPoint {
  time: number | string; // could be timestamp, frame, or formatted time
  value: number;
}

interface TimeSeriesPlotProps {
  data: TimeSeriesPoint[];
  label?: string;
  color?: string;
  height?: number;
}

const TimeSeriesPlot: React.FC<TimeSeriesPlotProps> = ({
  data,
  label = "Value",
  color = "#8884d8",
  height = 300,
}) => {
  return (
    <div className="p-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            label={{ value: "Time", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: label, angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesPlot;
