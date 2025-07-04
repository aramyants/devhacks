
import React from 'react';

const CompanyList = ({ companies, onEdit, onDelete, isLoading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <div className="loading">Loading companies...</div>;
  }

  if (companies.length === 0) {
    return (
      <div className="empty-state">
        <h3>No companies found</h3>
        <p>Click "Add New Company" to get started</p>
      </div>
    );
  }

  return (
    <div className="companies-table-container">
      <table className="companies-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Details</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.name}</td>
              <td>
                {company.details 
                  ? company.details.length > 100 
                    ? `${company.details.substring(0, 100)}...`
                    : company.details
                  : 'No details'
                }
              </td>
              <td>{formatDate(company.created_at)}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEdit(company)}
                >
                  Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDelete(company.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyList;
