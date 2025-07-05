// src/pages/CompanySettings.jsx
import React, { useEffect, useState } from "react";
import { companyApi } from "../services/api";
import { useTenant } from "./TenantContext";

/**
 * Company Settings & Privacy page
 *
 * Props:
 *   - companyId (number)  Optional. Defaults to 1.
 */
export default function CompanySettings({ companyId = 1 }) {
  const { tenant } = useTenant();
  // ---------- STATE ----------
  const [form, setForm] = useState({
    companyName: "",
    contactEmail: "",
    phoneNumber: "",
    description: "",
    privacyPolicy: "",
    acceptsMarketing: false,
  });
  const [status, setStatus] = useState("idle"); // idle | loading | saving | success | error
  const [error, setError] = useState(null);

  // ---------- FETCH ON MOUNT ----------
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setStatus("loading");
        const data = await companyApi.getCompany(companyId);
        setForm({
          companyName: data.companyName ?? "",
          contactEmail: data.contactEmail ?? "",
          phoneNumber: data.phoneNumber ?? "",
          description: data.description ?? "",
          privacyPolicy: data.privacyPolicy ?? "",
          acceptsMarketing: data.acceptsMarketing ?? false,
        });
        setStatus("idle");
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };

    fetchCompany();
  }, [companyId]);

  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("saving");
      await companyApi.updateCompany(companyId, form);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  // ---------- RENDER ----------
  if (status === "loading")
    return <p style={{ padding: "1rem" }}>Loading company data…</p>;

  if (status === "error")
    return <p style={{ padding: "1rem", color: "crimson" }}>Error: {error}</p>;

  return (
    <section className="company-settings">
      <div className="settings-header">
        <h2 className="settings-title">Company Settings & Privacy</h2>
        <div className="tenant-info">
          <span className="tenant-label">Tenant:</span>
          <span className="tenant-name">{tenant?.name}</span>
        </div>
        <p className="settings-description">
          Update company contact details and privacy preferences below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-grid">
          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="companyName" className="form-label">
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              className="form-input"
              value={form.companyName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Email */}
          <div className="form-group">
            <label htmlFor="contactEmail" className="form-label">
              Contact Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              className="form-input"
              value={form.contactEmail}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className="form-input"
              pattern="^[0-9()+\\-\\s]*$"
              placeholder="+1 (123) 456-7890"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>

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

        <button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save Changes"}
        </button>

        {status === "success" && (
          <span style={{ marginLeft: 12, color: "green" }}>Saved!</span>
        )}
      </form>
    </section>
  );
}