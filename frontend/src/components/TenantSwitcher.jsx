import React from 'react';
import { useTenant } from './TenantContext';

export default function TenantSwitcher() {
  const { tenant, setTenantId, tenants } = useTenant();

  return (
    <div className="tenant-switcher">
      <img src={tenant.logo} alt={tenant.name} style={{ height: 32, marginRight: 8 }} />
      <select
        value={tenant.id}
        onChange={e => setTenantId(Number(e.target.value))}
        style={{ fontWeight: 'bold', fontSize: '1rem' }}
      >
        {tenants.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}
