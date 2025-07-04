
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const companyApi = {
  // Get all companies
  getCompanies: async () => {
    try {
      const response = await api.get('/companies');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch companies');
    }
  },

  // Get a single company by ID
  getCompany: async (id) => {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch company');
    }
  },

  // Create a new company
  createCompany: async (companyData) => {
    try {
      const response = await api.post('/companies', companyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create company');
    }
  },

  // Update an existing company
  updateCompany: async (id, companyData) => {
    try {
      const response = await api.put(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update company');
    }
  },

  // Delete a company
  deleteCompany: async (id) => {
    try {
      await api.delete(`/companies/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete company');
    }
  },
};

export default api;
