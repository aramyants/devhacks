// src/pages/CompanySettings.jsx
import React, { useEffect, useState } from 'react';
import { companyApi } from '../services/api';
import { useTenant } from './TenantContext';

/**
 * Company Settings & Privacy page
 *
 * Props:
 *   - companyId (number)  Optional. Defaults to 1.
 */
export default function CompanySettings({ companyId = 1 }) {
  const { tenant } = useTenant();
  // ---------- STATE ----------
  const [form,   setForm]   = useState({
    companyName: '',
    contactEmail: '',
    phoneNumber: '',
    description: '',
    privacyPolicy: '',
    acceptsMarketing: false,
  });
  const [status, setStatus] = useState('idle');   // idle | loading | saving | success | error
  const [error,  setError]  = useState(null);

  // ---------- FETCH ON MOUNT ----------
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setStatus('loading');
        const data = await companyApi.getCompany(companyId);
        setForm({
          companyName:      data.companyName      ?? '',
          contactEmail:     data.contactEmail     ?? '',
          phoneNumber:      data.phoneNumber      ?? '',
          description:      data.description      ?? '',
          privacyPolicy:    data.privacyPolicy    ?? '',
          acceptsMarketing: data.acceptsMarketing ?? false,
        });
        setStatus('idle');
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    fetchCompany();
  }, [companyId]);

  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus('saving');
      await companyApi.updateCompany(companyId, form);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  // ---------- RENDER ----------
  if (status === 'loading')
    return <p style={{ padding: '1rem' }}>Loading company data…</p>;

  if (status === 'error')
    return (
      <p style={{ padding: '1rem', color: 'crimson' }}>
        Error: {error}
      </p>
    );

  return (
    <section className="company-settings">
      <h2>Company Settings&nbsp;&amp;&nbsp;Privacy</h2>
      <div style={{ marginBottom: 16, color: '#888', fontSize: 15 }}>
        <b>Tenant:</b> {tenant.name}
      </div>
      <p>Update company contact details and privacy-policy preferences below.</p>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Company Name */}
        <label>
          Company Name
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
          />
        </label>

        {/* Contact Email */}
        <label>
          Contact&nbsp;E-mail
          <input
            type="email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            required
          />
        </label>

        {/* Phone Number */}
        <label>
          Phone Number
          <input
            type="tel"
            name="phoneNumber"
            pattern="^[0-9()+\\-\\s]*$"
            placeholder="+1 (123) 456-7890"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </label>

        {/* Company Description */}
        <label>
          Company Description
          <textarea
            name="description"
            rows={3}
            placeholder="Brief description of what your company does"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        {/* Privacy Policy */}
        <label>
          Privacy Policy
          <textarea
            name="privacyPolicy"
            rows={6}
            placeholder="Add or edit your company’s privacy policy here"
            value={form.privacyPolicy}
            onChange={handleChange}
          />
        </label>

        {/* Marketing Opt-in */}
        <label className="checkbox">
          <input
            type="checkbox"
            name="acceptsMarketing"
            checked={form.acceptsMarketing}
            onChange={handleChange}
          />
          Allow marketing e-mails to customers
        </label>

        <button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save Changes'}
        </button>

        {status === 'success' && (
          <span style={{ marginLeft: 12, color: 'green' }}>Saved!</span>
        )}
      </form>
    </section>
  );
}
