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
            <th>Industry</th>
            <th>Country</th>
            <th>City</th>
            <th>Website</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.name}</td>
              <td>{company.industry || '-'}</td>
              <td>{company.country || '-'}</td>
              <td>{company.city || '-'}</td>
              <td>{company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer">🌐</a> : '-'}</td>
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
