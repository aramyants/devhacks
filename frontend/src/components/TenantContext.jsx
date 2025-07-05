import React, { createContext, useContext, useState } from 'react';

// Example tenants (replace with API call in production)
const tenants = [
  { id: 1, name: 'Acme Corp', logo: '/public/vite.svg', theme: { primary: '#3498db' } },
  { id: 2, name: 'Globex Inc', logo: '/src/assets/react.svg', theme: { primary: '#e67e22' } },
];

const TenantContext = createContext();

export function TenantProvider({ children }) {
  const [tenantId, setTenantId] = useState(tenants[0].id);
  const tenant = tenants.find(t => t.id === tenantId);

  return (
    <TenantContext.Provider value={{ tenant, setTenantId, tenants }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
