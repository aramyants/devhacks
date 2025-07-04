
import React, { useState, useEffect } from 'react';
import CompanyList from './CompanyList';
import CompanyForm from './CompanyForm';
import { companyApi } from '../services/api';

function Company() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await companyApi.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsFormOpen(true);
    setError('');
    setSuccess('');
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
    setError('');
    setSuccess('');
  };

  const handleSaveCompany = async (companyData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (editingCompany) {
        // Update existing company
        await companyApi.updateCompany(editingCompany.id, companyData);
        setSuccess('Company updated successfully!');
      } else {
        // Create new company
        await companyApi.createCompany(companyData);
        setSuccess('Company created successfully!');
      }
      
      setIsFormOpen(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      try {
        await companyApi.deleteCompany(companyId);
        setSuccess('Company deleted successfully!');
        await loadCompanies();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
    setError('');
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div>
      <div className="page-header">
        <h2>Company Management</h2>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <button 
        className="add-company-btn" 
        onClick={handleAddCompany}
        disabled={isLoading}
      >
        Add New Company
      </button>

      <CompanyList
        companies={companies}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompany}
        isLoading={isLoading}
      />

      {isFormOpen && (
        <CompanyForm
          company={editingCompany}
          onSave={handleSaveCompany}
          onCancel={handleCloseForm}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default Company;
