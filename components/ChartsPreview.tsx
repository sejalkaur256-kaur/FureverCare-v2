"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";

// Consistent Color Theme matching tokens
const COLORS = {
  primary: "#0EA5A4",    // Teal
  secondary: "#22C55E",  // Green
  accent: "#F97316",     // Orange
  danger: "#EF4444",     // Red
  muted: "#94A3B8",      // Slate-400
  grid: "#E2E8F0",       // Slate-200
};

// 1. Severity Distribution Data (Pie Chart)
const severityData = [
  { name: "Low Severity", value: 45, color: COLORS.secondary },
  { name: "Medium Severity", value: 35, color: COLORS.accent },
  { name: "High Severity/Emergency", value: 20, color: COLORS.danger },
];

export function SeverityDistributionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={severityData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {severityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1E293B",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// 2. Monthly Rescues Data (Bar / Line Combo Chart)
const monthlyData = [
  { month: "Jan", rescues: 32, successRate: 92 },
  { month: "Feb", rescues: 40, successRate: 95 },
  { month: "Mar", rescues: 58, successRate: 88 },
  { month: "Apr", rescues: 64, successRate: 94 },
  { month: "May", rescues: 75, successRate: 96 },
  { month: "Jun", rescues: 90, successRate: 97 },
];

export function MonthlyRescuesChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
          <XAxis dataKey="month" stroke={COLORS.muted} fontSize={11} tickLine={false} />
          <YAxis stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#1E293B",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="rescues" fill={COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. Volunteer Activity (Line Chart)
const volunteerData = [
  { day: "Mon", active: 24, completed: 18 },
  { day: "Tue", active: 28, completed: 22 },
  { day: "Wed", active: 35, completed: 29 },
  { day: "Thu", active: 30, completed: 25 },
  { day: "Fri", active: 42, completed: 36 },
  { day: "Sat", active: 55, completed: 48 },
  { day: "Sun", active: 48, completed: 40 },
];

export function VolunteerActivityChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={volunteerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
          <XAxis dataKey="day" stroke={COLORS.muted} fontSize={11} tickLine={false} />
          <YAxis stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#1E293B",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="active"
            name="Active Volunteers"
            stroke={COLORS.accent}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            name="Rescues Completed"
            stroke={COLORS.primary}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 4. Response Metrics (Area Chart)
const responseData = [
  { hour: "00:00", dispatchTime: 8, arrivalTime: 22 },
  { hour: "04:00", dispatchTime: 6, arrivalTime: 18 },
  { hour: "08:00", dispatchTime: 12, arrivalTime: 30 },
  { hour: "12:00", dispatchTime: 10, arrivalTime: 25 },
  { hour: "16:00", dispatchTime: 15, arrivalTime: 35 },
  { hour: "20:00", dispatchTime: 9, arrivalTime: 21 },
];

export function ResponseMetricsChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={responseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDispatch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorArrival" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
          <XAxis dataKey="hour" stroke={COLORS.muted} fontSize={11} tickLine={false} />
          <YAxis stroke={COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#1E293B",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="dispatchTime"
            name="Dispatch Time (min)"
            stroke={COLORS.primary}
            fillOpacity={1}
            fill="url(#colorDispatch)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="arrivalTime"
            name="Total Arrival (min)"
            stroke={COLORS.accent}
            fillOpacity={1}
            fill="url(#colorArrival)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 5. Confidence Scores (Bar Chart)
const confidenceData = [
  { name: "Dog Detection", score: 94 },
  { name: "Cat Detection", score: 92 },
  { name: "Cow Detection", score: 86 },
  { name: "Goat Detection", score: 81 },
  { name: "Bird Detection", score: 89 },
];

export function ConfidenceScoresChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={confidenceData}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
          <XAxis type="number" domain={[0, 100]} stroke={COLORS.muted} fontSize={11} tickLine={false} />
          <YAxis dataKey="name" type="category" stroke={COLORS.muted} fontSize={11} tickLine={false} width={100} />
          <Tooltip
            contentStyle={{
              background: "#1E293B",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="score" name="Avg Confidence %" fill={COLORS.secondary} radius={[0, 4, 4, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
