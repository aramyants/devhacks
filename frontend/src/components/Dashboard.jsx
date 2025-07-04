import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const kpis = {
  totalCalls: 120,
  bookedCalls: 45,
  avgHandleTime: '2m 30s',
};

const pieData = [
  { name: 'Booked', value: kpis.bookedCalls },
  { name: 'Not Booked', value: kpis.totalCalls - kpis.bookedCalls },
];

const COLORS = ['#0088FE', '#FF8042'];

export default function Dashboard() {
  const conversion = (
    (kpis.bookedCalls / kpis.totalCalls) *
    100
  ).toFixed(1);

  return (
    <>
      <h2>Dashboard</h2>

      <section className="kpi-cards">
        <div className="card">
          <h3>Total Calls</h3>
          <p>{kpis.totalCalls}</p>
        </div>
        <div className="card">
          <h3>Bookings</h3>
          <p>{kpis.bookedCalls}</p>
        </div>
        <div className="card">
          <h3>Conversion Rate</h3>
          <p>{conversion}%</p>
        </div>
        <div className="card">
          <h3>Avg Handle Time</h3>
          <p>{kpis.avgHandleTime}</p>
        </div>
      </section>

      <section style={{ height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}
