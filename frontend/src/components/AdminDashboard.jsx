import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { companyApi, dashboardApi } from "../services/api";

const COLORS = [
  "#5f6fff",
  "#27ae60",
  "#e67e22",
  "#e74c3c",
  "#aab6ff",
  "#3b3bff",
  "#f39c12",
  "#9b59b6",
];

export default function AdminDashboard() {
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("30d");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [companiesData, statsData] = await Promise.all([
          companyApi.getCompanies(),
          dashboardApi.getAdminStats(timeFilter),
        ]);
        setCompanies(companiesData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setCompanies([]);
        setStats({});
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeFilter]);

  const industryData = companies.reduce((acc, company) => {
    const industry = company.industry || "Other";
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});

  const sizeData = companies.reduce((acc, company) => {
    const size = company.size || "Unknown";
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {});

  const countryData = companies.reduce((acc, company) => {
    const country = company.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const industryChart = Object.entries(industryData).map(([name, value]) => ({
    name,
    value,
  }));
  const sizeChart = Object.entries(sizeData).map(([name, value]) => ({
    name,
    value,
  }));
  const countryChart = Object.entries(countryData)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 8);

  const recentCompanies = companies
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Super Admin Dashboard</h1>
          <p>Manage and monitor all companies across the platform</p>
        </div>
        <div className="header-actions">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="time-filter"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card primary">
          <div className="kpi-icon">🏢</div>
          <div className="kpi-content">
            <h3>Total Companies</h3>
            <div className="kpi-value">{companies.length}</div>
            <div className="kpi-change positive">
              +{stats.newCompanies || 0} this month
            </div>
          </div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <h3>Total Users</h3>
            <div className="kpi-value">{stats.totalUsers || 0}</div>
            <div className="kpi-change positive">
              +{stats.newUsers || 0} this month
            </div>
          </div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <h3>Total Products</h3>
            <div className="kpi-value">{stats.totalProducts || 0}</div>
            <div className="kpi-change positive">
              +{stats.newProducts || 0} this month
            </div>
          </div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-icon">🌍</div>
          <div className="kpi-content">
            <h3>Countries</h3>
            <div className="kpi-value">{Object.keys(countryData).length}</div>
            <div className="kpi-change neutral">Global presence</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Industry Distribution</h3>
            <p>Companies by industry sector</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {industryChart.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Company Sizes</h3>
            <p>Distribution by employee count</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sizeChart}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#5f6fff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Geographic Distribution</h3>
            <p>Companies by country</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryChart}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#27ae60" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Recent Companies</h3>
            <p>Latest company registrations</p>
          </div>
          <div className="recent-companies">
            {recentCompanies.map((company) => (
              <div key={company.id} className="company-item">
                <div className="company-avatar">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} />
                  ) : (
                    <div className="company-initial">
                      {company.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="company-info">
                  <div className="company-name">{company.name}</div>
                  <div className="company-meta">
                    {company.industry} • {company.country}
                  </div>
                </div>
                <div className="company-date">
                  {new Date(company.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
