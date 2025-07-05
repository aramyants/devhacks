import React, { useState, useEffect, useRef } from "react";
import { useTenant } from "./TenantContext";
import { companyApi } from "../services/api";

export default function TenantSwitcher() {
  const { tenant, setTenantId, tenants, loading } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTenants, setFilteredTenants] = useState([]);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (tenants) {
      const filtered = tenants.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.industry || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.country || "").toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredTenants(filtered);
    }
  }, [searchTerm, tenants]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleTenantSelect = (selectedTenant) => {
    setTenantId(selectedTenant.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  if (loading) {
    return (
      <div className="cosmic-tenant-switcher loading">
        <div className="cosmic-spinner"></div>
        <span>Loading companies...</span>
      </div>
    );
  }

  if (!tenant) {
    return null;
  }

  return (
    <div className="cosmic-tenant-switcher" ref={dropdownRef}>
      <button
        className={`tenant-trigger ${isOpen ? "active" : ""}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="tenant-avatar">
          {tenant.logo ? (
            <img src={tenant.logo} alt={tenant.name} />
          ) : (
            <div className="tenant-initial">{tenant.name.charAt(0)}</div>
          )}
          <div className="cosmic-ring"></div>
        </div>
        <div className="tenant-info">
          <span className="tenant-name">{tenant.name}</span>
          <span className="tenant-meta">
            {tenant.industry} • {tenant.country}
          </span>
        </div>
        <div className="tenant-chevron">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="tenant-dropdown">
          <div className="cosmic-backdrop"></div>
          <div className="dropdown-content">
            <div className="search-container">
              <div className="cosmic-search">
                <svg
                  className="search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="21 21l-4.35-4.35"></path>
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="tenant-list">
              {filteredTenants.length > 0 ? (
                <>
                  <div className="list-header">
                    <span>{filteredTenants.length} companies found</span>
                  </div>
                  {filteredTenants.map((t) => (
                    <button
                      key={t.id}
                      className={`tenant-option ${t.id === tenant.id ? "selected" : ""}`}
                      onClick={() => handleTenantSelect(t)}
                    >
                      <div className="option-avatar">
                        {t.logo ? (
                          <img src={t.logo} alt={t.name} />
                        ) : (
                          <div className="option-initial">
                            {t.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="option-info">
                        <div className="option-name">{t.name}</div>
                        <div className="option-meta">
                          {t.industry && (
                            <span className="industry">{t.industry}</span>
                          )}
                          {t.country && (
                            <span className="country">{t.country}</span>
                          )}
                          {t.founded_year && (
                            <span className="year">Est. {t.founded_year}</span>
                          )}
                        </div>
                      </div>
                      {t.id === tenant.id && (
                        <div className="selected-indicator">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <polyline points="20,6 9,17 4,12"></polyline>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <div className="empty-message">
                    {searchTerm
                      ? `No companies found for "${searchTerm}"`
                      : "No companies available"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
