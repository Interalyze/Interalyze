"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const chartData = [
  { question: "Q1", stress: 0.7, personality: 0.9 },
  { question: "Q2", stress: 0.5, personality: 0.8 },
  { question: "Q3", stress: 0.6, personality: 0.85 },
  { question: "Q4", stress: 0.8, personality: 0.92 },
];

export default function DashboardChart() {
  return (
    <div>
      <h2 className="mt-4">Analysis Graphs</h2>
      <AreaChart
        width={600}
        height={300}
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="question" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="stress" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area
          type="monotone"
          dataKey="personality"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </AreaChart>
    </div>
  );
}
