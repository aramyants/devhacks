
import React, { useState, useEffect } from 'react';

const CompanyForm = ({ company, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    details: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        details: company.details || '',
      });a
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{company ? 'Edit Company' : 'Add New Company'}</h2>
          <button className="close-btn" onClick={onCancel} type="button">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Company Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="details">Details</label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Enter company details"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? 'Saving...' : 'Save Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
