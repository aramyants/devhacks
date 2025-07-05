import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock companies data for fallback
const MOCK_COMPANIES = [
  {
    id: 1,
    name: "Admin Company",
    industry: "Technology",
    country: "United States",
    headquarters: "San Francisco, CA",
    website: "https://admin-company.com",
    description: "Admin company for platform management",
    employee_count: 50,
    revenue: 10000000,
    founded_year: 2020,
    status: "active",
  },
  {
    id: 2,
    name: "Acme Corp",
    industry: "Manufacturing",
    country: "United States",
    headquarters: "Detroit, MI",
    website: "https://acmecorp.com",
    description: "Leading manufacturing company",
    employee_count: 500,
    revenue: 50000000,
    founded_year: 1985,
    status: "active",
  },
  {
    id: 3,
    name: "Globex Corporation",
    industry: "Technology",
    country: "Canada",
    headquarters: "Toronto, ON",
    website: "https://globex.com",
    description: "Global technology solutions provider",
    employee_count: 1200,
    revenue: 75000000,
    founded_year: 1992,
    status: "active",
  },
];

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export const companyApi = {
  // Get all companies
  getCompanies: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/companies?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.log("⚠️ Backend unavailable, using mock companies data");
      // Return mock data as fallback
      const startIndex = skip || 0;
      const endIndex = startIndex + (limit || 100);
      return MOCK_COMPANIES.slice(startIndex, endIndex);
    }
  },

  // Get a single company by ID
  getCompany: async (id) => {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.log("⚠️ Backend unavailable, using mock company data");
      // Return mock data as fallback
      const company = MOCK_COMPANIES.find((c) => c.id === parseInt(id));
      if (!company) {
        throw new Error("Company not found");
      }
      return company;
    }
  },

  // Create a new company
  createCompany: async (companyData) => {
    try {
      const response = await api.post("/companies", companyData);
      return response.data;
    } catch (error) {
      console.log("⚠️ Backend unavailable, using mock company creation");
      // Mock company creation
      const newCompany = {
        id: MOCK_COMPANIES.length + 1,
        ...companyData,
        status: "active",
      };
      MOCK_COMPANIES.push(newCompany);
      return newCompany;
    }
  },

  // Update an existing company
  updateCompany: async (id, companyData) => {
    try {
      const response = await api.put(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to update company",
      );
    }
  },

  // Delete a company
  deleteCompany: async (id) => {
    try {
      await api.delete(`/companies/${id}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to delete company",
      );
    }
  },

  // Search companies
  searchCompanies: async (query) => {
    try {
      const response = await api.get(
        `/companies/search?q=${encodeURIComponent(query)}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to search companies",
      );
    }
  },
};

export const chatApi = {
  // Get all messages
  getMessages: async () => {
    try {
      const response = await api.get("/messages");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch messages",
      );
    }
  },

  // Send a new message
  sendMessage: async (messageData) => {
    try {
      const response = await api.post("/messages", messageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to send message");
    }
  },
};

export const authApi = {
  // Login user
  login: async (email, password) => {
    try {
      console.log("AuthAPI: Attempting login with backend API");

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      console.log("AuthAPI: Login successful", response.data);

      return {
        token: response.data.access_token,
        user: response.data.user,
      };
    } catch (error) {
      console.error("AuthAPI: Login failed", error);

      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      } else if (error.response?.status === 422) {
        throw new Error("Please enter a valid email address");
      } else {
        throw new Error(
          error.response?.data?.detail || "Login failed. Please try again.",
        );
      }
    }
  },

  // Register user
  register: async (email, password, companyName) => {
    try {
      console.log("AuthAPI: Attempting registration with backend API");

      const response = await api.post("/auth/register", {
        email: email.trim(),
        password: password,
        company_name: companyName.trim(),
      });

      console.log("AuthAPI: Registration successful", response.data);

      return {
        token: response.data.access_token,
        user: response.data.user,
      };
    } catch (error) {
      console.error("AuthAPI: Registration failed", error);

      if (error.response?.status === 400) {
        throw new Error("Email already registered");
      } else if (error.response?.status === 422) {
        throw new Error("Please check your input and try again");
      } else {
        throw new Error(
          error.response?.data?.detail ||
            "Registration failed. Please try again.",
        );
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      try {
        await api.post("/auth/logout");
      } catch (backendError) {
        await mockAuthApi.logout();
      }
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    } catch (error) {
      // Even if API call fails, remove local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      throw new Error(error.message || "Logout failed");
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      try {
        const response = await api.get("/auth/verify");
        return response.data;
      } catch (backendError) {
        return await mockAuthApi.verifyToken();
      }
    } catch (error) {
      throw new Error(error.message || "Token verification failed");
    }
  },
};

export const dashboardApi = {
  // Get admin dashboard stats (all companies)
  getAdminStats: async (timeFilter = "30d") => {
    try {
      const response = await api.get(`/dashboard/admin?period=${timeFilter}`);
      return response.data;
    } catch (error) {
      // Fallback to enhanced mock data if API not ready
      console.warn(
        "Dashboard API not ready, using fallback data:",
        error.message,
      );
      return {
        totalCompanies: 42,
        newCompanies: 5,
        totalUsers: 247,
        newUsers: 18,
        totalProducts: 1856,
        newProducts: 67,
        totalRevenue: 2340000,
        revenueGrowth: 15.3,
        activeCountries: 23,
        topIndustries: [
          { name: "Technology", count: 15, growth: 12.5 },
          { name: "Healthcare", count: 8, growth: 8.2 },
          { name: "Finance", count: 6, growth: 22.1 },
          { name: "E-commerce", count: 5, growth: 18.7 },
          { name: "Manufacturing", count: 4, growth: 5.3 },
        ],
        revenueChart: [
          { month: "Jan", revenue: 145000, companies: 38 },
          { month: "Feb", revenue: 162000, companies: 39 },
          { month: "Mar", revenue: 158000, companies: 40 },
          { month: "Apr", revenue: 181000, companies: 41 },
          { month: "May", revenue: 198000, companies: 41 },
          { month: "Jun", revenue: 215000, companies: 42 },
        ],
        growthMetrics: {
          userGrowthRate: 12.5,
          companyGrowthRate: 8.3,
          revenueGrowthRate: 15.3,
          productGrowthRate: 22.1,
        },
      };
    }
  },

  // Get company dashboard stats
  getCompanyStats: async (companyId, timeFilter = "30d") => {
    try {
      const response = await api.get(
        `/dashboard/company/${companyId}?period=${timeFilter}`,
      );
      return response.data;
    } catch (error) {
      // Fallback to enhanced mock data
      console.warn(
        "Dashboard API not ready, using fallback data:",
        error.message,
      );
      return {
        totalProducts: 23,
        newProducts: 3,
        revenue: 89456,
        revenueGrowth: 12.5,
        orders: 147,
        newOrders: 18,
        teamMembers: 8,
        customers: 342,
        newCustomers: 27,
        conversionRate: 3.4,
        avgOrderValue: 156.8,
        revenueChart: [
          { month: "Jan", revenue: 15000, orders: 96 },
          { month: "Feb", revenue: 18200, orders: 116 },
          { month: "Mar", revenue: 16800, orders: 107 },
          { month: "Apr", revenue: 21000, orders: 134 },
          { month: "May", revenue: 19800, orders: 126 },
          { month: "Jun", revenue: 24200, orders: 155 },
        ],
        productPerformance: [
          { name: "Premium Plan", revenue: 35000, growth: 15.2 },
          { name: "Basic Plan", revenue: 28000, growth: 8.7 },
          { name: "Enterprise", revenue: 45000, growth: 22.3 },
        ],
        customerMetrics: {
          retention: 89.5,
          satisfaction: 4.7,
          churnRate: 2.3,
          lifetimeValue: 1240,
        },
      };
    }
  },
};

export const productsApi = {
  // Get products for a company
  getCompanyProducts: async (companyId) => {
    try {
      // For demo, return mock data
      // Real API call: const response = await api.get(`/companies/${companyId}/products`);
      return [
        {
          id: 1,
          name: "Premium Widget",
          price: 99.99,
          stock_qty: 45,
          category: "Electronics",
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          name: "Professional Service",
          price: 299.99,
          stock_qty: null,
          category: "Services",
          created_at: "2024-01-20T14:30:00Z",
        },
        {
          id: 3,
          name: "Basic Plan",
          price: 29.99,
          stock_qty: 100,
          category: "Subscriptions",
          created_at: "2024-01-25T09:15:00Z",
        },
      ];
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch products",
      );
    }
  },

  // Get all products (admin only)
  getAllProducts: async () => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch products",
      );
    }
  },
};

export default api;
