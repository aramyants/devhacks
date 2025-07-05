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
import { dashboardApi } from "../services/api";
import { useTenant } from "./TenantContext";
import { useAuth } from "../context/AuthContext";

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

export default function TenantAnalytics() {
  const { tenant, tenantId, isAdmin } = useTenant();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("30d");

  useEffect(() => {
    async function fetchAnalytics() {
      if (!tenantId && !user?.companyId) return;

      setLoading(true);
      setError(null);

      try {
        let analyticsData;

        if (isAdmin && tenantId) {
          // Admin viewing specific company analytics
          analyticsData = await dashboardApi.getCompanyStats(
            tenantId,
            timeFilter,
          );
        } else if (user?.companyId) {
          // Regular user viewing their company analytics
          analyticsData = await dashboardApi.getCompanyStats(
            user.companyId,
            timeFilter,
          );
        } else {
          // Fallback to admin dashboard if no specific company selected
          analyticsData = await dashboardApi.getAdminStats(timeFilter);
        }

        setData(analyticsData);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [tenantId, user?.companyId, isAdmin, timeFilter]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h3>Failed to load analytics</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-container">
        <div className="empty-container">
          <h3>No analytics data available</h3>
          <p>Select a company from the dropdown to view analytics</p>
        </div>
      </div>
    );
  }

  const currentCompanyName =
    isAdmin && tenant ? tenant.name : user?.company?.name || "Company";

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Analytics Dashboard</h1>
          <div className="company-info">
            <span className="company-name">{currentCompanyName}</span>
            {isAdmin && tenant && (
              <span className="tenant-badge">
                {tenant.industry} • {tenant.country}
              </span>
            )}
          </div>
        </div>

        <div className="dashboard-controls">
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

      {/* Company-specific metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <h3>Total Products</h3>
            <div className="metric-value">{data.totalProducts || 0}</div>
            <div className="metric-change positive">
              +{data.newProducts || 0} new
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Revenue</h3>
            <div className="metric-value">
              ${(data.revenue || 0).toLocaleString()}
            </div>
            <div
              className={`metric-change ${data.revenueGrowth >= 0 ? "positive" : "negative"}`}
            >
              {data.revenueGrowth >= 0 ? "+" : ""}
              {data.revenueGrowth || 0}%
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <h3>Orders</h3>
            <div className="metric-value">{data.orders || 0}</div>
            <div className="metric-change positive">
              +{data.newOrders || 0} new
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Customers</h3>
            <div className="metric-value">{data.customers || 0}</div>
            <div className="metric-change positive">
              +{data.newCustomers || 0} new
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="chart-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Revenue Trend</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#5f6fff" }}
                ></span>
                Revenue
              </span>
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#27ae60" }}
                ></span>
                Orders
              </span>
            </div>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenueChart || []}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? `$${value.toLocaleString()}` : value,
                    name === "revenue" ? "Revenue" : "Orders",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5f6fff"
                  strokeWidth={3}
                  dot={{ fill: "#5f6fff", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#27ae60"
                  strokeWidth={3}
                  dot={{ fill: "#27ae60", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      {data.productPerformance && (
        <div className="chart-section">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Product Performance</h3>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.productPerformance}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#5f6fff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Customer Metrics */}
      {data.customerMetrics && (
        <div className="chart-section">
          <div className="metrics-grid">
            <div className="metric-card secondary">
              <div className="metric-content">
                <h4>Customer Retention</h4>
                <div className="metric-value">
                  {data.customerMetrics.retention}%
                </div>
              </div>
            </div>
            <div className="metric-card secondary">
              <div className="metric-content">
                <h4>Satisfaction Score</h4>
                <div className="metric-value">
                  {data.customerMetrics.satisfaction}/5
                </div>
              </div>
            </div>
            <div className="metric-card secondary">
              <div className="metric-content">
                <h4>Churn Rate</h4>
                <div className="metric-value">
                  {data.customerMetrics.churnRate}%
                </div>
              </div>
            </div>
            <div className="metric-card secondary">
              <div className="metric-content">
                <h4>Lifetime Value</h4>
                <div className="metric-value">
                  ${data.customerMetrics.lifetimeValue}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
