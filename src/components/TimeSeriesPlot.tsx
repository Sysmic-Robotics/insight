import React, { useState, useEffect, useRef } from "react";
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
  time: number | string;
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
  const [xDomain, setXDomain] = useState<[number, number]>([0, 100]);
  const [yDomain, setYDomain] = useState<[number, number]>([-10, 10]);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const xRange = xDomain[1] - xDomain[0];
    const yRange = yDomain[1] - yDomain[0];
    const xShift = -dx / 300 * xRange;
    const yShift = dy / 300 * yRange;
    setXDomain(([x0, x1]) => [x0 + xShift, x1 + xShift]);
    setYDomain(([y0, y1]) => [y0 + yShift, y1 + yShift]);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const [x0, x1] = xDomain;
    const [y0, y1] = yDomain;
    const xMid = (x0 + x1) / 2;
    const yMid = (y0 + y1) / 2;
    const xRange = (x1 - x0) * scale;
    const yRange = (y1 - y0) * scale;
    setXDomain([xMid - xRange / 2, xMid + xRange / 2]);
    setYDomain([yMid - yRange / 2, yMid + yRange / 2]);
  };

  return (
    <div
      className="p-4"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            type="number"
            domain={xDomain}
            tick={{ fontSize: 12 }}
            label={{ value: "Time", position: "insideBottom", offset: -5 }}
            allowDataOverflow
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12 }}
            label={{ value: label, angle: -90, position: "insideLeft" }}
            allowDataOverflow
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
