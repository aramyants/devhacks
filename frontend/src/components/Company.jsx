import React, { useEffect, useState } from 'react';
import { companyApi } from '../services/api';
import CompanyForm from './CompanyForm';
import CompanyList from './CompanyList';
import { useTenant } from './TenantContext';

export default function Company({ user }) {
  const { tenant } = useTenant();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Only admin can see all companies and switch tenants
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadCompanies();
  }, [tenant.id, isAdmin]);

  const loadCompanies = async () => {
    setIsLoading(true);
    setError('');
    try {
      let data;
      if (isAdmin) {
        data = await companyApi.getCompanies(); // all companies
      } else {
        // company owner: only see their own company (simulate by filtering)
        data = await companyApi.getCompanies();
        data = data.filter(c => c.id === tenant.id);
      }
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
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h2>Company Management</h2>
        <span style={{ color: '#888', fontSize: 15 }}>
          <b>Tenant:</b> {tenant.name}
        </span>
        {isAdmin && <span style={{ color: '#3498db', fontWeight: 600 }}>(Admin Mode: can manage all companies)</span>}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <button
        className="add-company-btn"
        onClick={handleAddCompany}
        disabled={isLoading || (!isAdmin && companies.length > 0)}
        title={isAdmin ? '' : 'Only one company allowed per owner'}
        style={{ boxShadow: '0 4px 16px #5f6fff22', fontSize: '1.08rem', letterSpacing: '.01em', marginBottom: 18, marginTop: 8 }}
      >
        <span style={{ fontSize: 20, marginRight: 8, verticalAlign: 'middle' }}>＋</span> Add New Company
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

// --- LOGIN INFO FOR DEMO ---
// To log in as a company owner and see the dashboard, use:
// Email: owner@acme.com   Password: any
// Email: owner@globex.com Password: any
// Only these emails will work for demo login.
