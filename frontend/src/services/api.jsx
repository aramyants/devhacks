import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  getCompanies: async () => {
    try {
      const response = await api.get("/companies");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch companies",
      );
    }
  },

  // Get a single company by ID
  getCompany: async (id) => {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to fetch company",
      );
    }
  },

  // Create a new company
  createCompany: async (companyData) => {
    try {
      const response = await api.post("/companies", companyData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to create company",
      );
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
      // For demo purposes, we'll simulate the backend response
      // In production, this would be a real API call
      if (email === "admin@saas.com" && password === "demo123") {
        return {
          token: "demo-admin-token",
          user: { email, role: "admin", id: 1 },
        };
      } else if (email === "owner@acme.com" && password === "demo123") {
        return {
          token: "demo-owner-token-1",
          user: { email, role: "owner", companyId: 1, id: 2 },
        };
      } else if (email === "owner@globex.com" && password === "demo123") {
        return {
          token: "demo-owner-token-2",
          user: { email, role: "owner", companyId: 2, id: 3 },
        };
      } else {
        throw new Error("Invalid email or password");
      }

      // Real API call would be:
      // const response = await api.post('/auth/login', { email, password });
      // return response.data;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  // Register user
  register: async (email, password, companyName) => {
    try {
      // For demo purposes, simulate registration
      // In production, this would create a real user and company
      const newUser = {
        email,
        role: "owner",
        companyId: Math.floor(Math.random() * 1000) + 100,
        id: Math.floor(Math.random() * 1000) + 10,
      };

      return {
        token: `demo-new-user-token-${newUser.id}`,
        user: newUser,
      };

      // Real API call would be:
      // const response = await api.post('/auth/register', { email, password, companyName });
      // return response.data;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Real API call would be:
      // await api.post('/auth/logout');
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    } catch (error) {
      throw new Error(error.message || "Logout failed");
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Token verification failed");
    }
  },
};

export default api;
