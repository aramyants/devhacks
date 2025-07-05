import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { companyApi, dashboardApi, productsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#5f6fff", "#27ae60", "#e67e22", "#e74c3c"];

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState({});
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("30d");

  useEffect(() => {
    async function fetchData() {
      if (!user?.companyId) return;

      setLoading(true);
      try {
        const [companyData, productsData, statsData] = await Promise.all([
          companyApi.getCompany(user.companyId),
          productsApi.getCompanyProducts(user.companyId),
          dashboardApi.getCompanyStats(user.companyId, timeFilter),
        ]);
        setCompany(companyData);
        setProducts(productsData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.companyId, timeFilter]);

  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChart = Object.entries(productsByCategory).map(
    ([name, value]) => ({ name, value }),
  );

  const recentProducts = products
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="company-header">
            {company.logo && (
              <div className="company-logo">
                <img src={company.logo} alt={company.name} />
              </div>
            )}
            <div>
              <h1>{company.name}</h1>
              <p className="company-tagline">
                {company.tagline || "Company Dashboard"}
              </p>
              <div className="company-meta">
                {company.industry} • {company.country} • Est.{" "}
                {company.founded_year}
              </div>
            </div>
          </div>
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
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card primary">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <h3>Products</h3>
            <div className="kpi-value">{products.length}</div>
            <div className="kpi-change positive">
              +{stats.newProducts || 0} this month
            </div>
          </div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h3>Revenue</h3>
            <div className="kpi-value">${stats.revenue || "0"}</div>
            <div className="kpi-change positive">
              +{stats.revenueGrowth || "0"}% this month
            </div>
          </div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-icon">🛍️</div>
          <div className="kpi-content">
            <h3>Orders</h3>
            <div className="kpi-value">{stats.orders || 0}</div>
            <div className="kpi-change positive">
              +{stats.newOrders || 0} this month
            </div>
          </div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <h3>Team Members</h3>
            <div className="kpi-value">{stats.teamMembers || 1}</div>
            <div className="kpi-change neutral">Active users</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Product Categories</h3>
            <p>Distribution of your products</p>
          </div>
          <div className="chart-container">
            {categoryChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChart}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryChart.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p>No products yet</p>
                <button className="btn-primary">Add your first product</button>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue Trend</h3>
            <p>Monthly revenue over time</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.revenueChart || []}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5f6fff"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Company Profile</h3>
            <p>Your company information</p>
          </div>
          <div className="company-profile">
            <div className="profile-item">
              <span className="profile-label">Industry:</span>
              <span className="profile-value">
                {company.industry || "Not specified"}
              </span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Size:</span>
              <span className="profile-value">
                {company.size || "Not specified"}
              </span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Location:</span>
              <span className="profile-value">
                {company.city
                  ? `${company.city}, ${company.country}`
                  : company.country || "Not specified"}
              </span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Website:</span>
              <span className="profile-value">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.website}
                  </a>
                ) : (
                  "Not specified"
                )}
              </span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Contact:</span>
              <span className="profile-value">
                {company.contact_email || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Recent Products</h3>
            <p>Latest additions to your catalog</p>
          </div>
          <div className="recent-products">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="product-item">
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-meta">
                      ${product.price} • Stock: {product.stock_qty || 0}
                    </div>
                  </div>
                  <div className="product-date">
                    {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No products yet</p>
                <button className="btn-primary">Add Product</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
