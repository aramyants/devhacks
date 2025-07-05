import React, { useEffect, useState } from 'react';
import { useTenant } from './TenantContext';

const initialForm = {
  name: '',
  details: '',
  industry: '',
  website: '',
  logo: '',
  tagline: '',
  mission: '',
  vision: '',
  values: '',
  founded_year: '',
  size: '',
  country: '',
  city: '',
  contact_email: '',
  phone: '',
  social_links: '', // JSON string
  extra: '',        // JSON string
};

const CompanyForm = ({ company, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState(initialForm);
  const [step, setStep] = useState(0);
  const { tenant } = useTenant();

  useEffect(() => {
    if (company) {
      setFormData({ ...initialForm, ...company });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((s) => s + 1);
  };
  const handleBack = (e) => {
    e.preventDefault();
    setStep((s) => s - 1);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 400 }}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '-1px', fontSize: '1.5rem' }}>
            {company ? 'Edit Company' : 'Add New Company'}
          </h2>
          <button className="close-btn" onClick={onCancel} type="button" style={{ fontSize: 28, color: 'var(--primary)' }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <>
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
                <label htmlFor="details">About / Description</label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="What does your company do?"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. SaaS, Healthcare, Marketing"
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="save-btn" onClick={handleNext} disabled={!formData.name.trim()}>Next</button>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="logo">Logo URL</label>
                <input
                  type="url"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="Paste logo image URL"
                />
                {formData.logo && (
                  <img src={formData.logo} alt="Logo preview" style={{ maxHeight: 48, marginTop: 8, borderRadius: 8 }} />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="tagline">Tagline / Slogan</label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Empowering the Future"
                />
              </div>
              <div className="form-group">
                <label htmlFor="mission">Mission Statement</label>
                <input
                  type="text"
                  id="mission"
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  placeholder="What is your company's mission?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="vision">Vision</label>
                <input
                  type="text"
                  id="vision"
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  placeholder="What is your vision for the future?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="values">Core Values</label>
                <input
                  type="text"
                  id="values"
                  name="values"
                  value={formData.values}
                  onChange={handleChange}
                  placeholder="Comma-separated values (e.g. Innovation, Trust)"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleBack}>Back</button>
                <button type="button" className="save-btn" onClick={handleNext}>Next</button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="founded_year">Founded Year</label>
                <input
                  type="number"
                  id="founded_year"
                  name="founded_year"
                  value={formData.founded_year}
                  onChange={handleChange}
                  placeholder="e.g. 2010"
                />
              </div>
              <div className="form-group">
                <label htmlFor="size">Company Size</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g. 1-10, 11-50, 51-200"
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. USA"
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Boston"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact_email">Contact Email</label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="info@company.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1-555-1234"
                />
              </div>
              <div className="form-group">
                <label htmlFor="social_links">Social Links (JSON)</label>
                <input
                  type="text"
                  id="social_links"
                  name="social_links"
                  value={formData.social_links}
                  onChange={handleChange}
                  placeholder='{"linkedin": "https://..."}'
                />
              </div>
              <div className="form-group">
                <label htmlFor="extra">Extra (JSON)</label>
                <input
                  type="text"
                  id="extra"
                  name="extra"
                  value={formData.extra}
                  onChange={handleChange}
                  placeholder='{"custom_field": "value"}'
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleBack}>Back</button>
                <button type="submit" className="save-btn" disabled={isLoading || !formData.name.trim()}>{isLoading ? 'Saving...' : 'Save Company'}</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
