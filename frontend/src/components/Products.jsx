import React, { useEffect, useState } from 'react';
import { companyApi } from '../services/api';

export default function Products() {
  const [items, setItems]   = useState([]);
  const [form,  setForm]    = useState({ id: null, name: '', price: '' });
  const [busy,  setBusy]    = useState(false);
  const [error, setError]   = useState(null);

  /* ─────────────────────────
     Helpers
  ──────────────────────────*/
  const resetForm = () => setForm({ id: null, name: '', price: '' });

  const fetchProducts = async () => {
    setBusy(true);
    try {
      const { data } = await api.get('/products');
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setBusy(false);
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (form.id) {
        // update
        const payload = { ...form, price: +form.price };
        await api.put(`/products/${form.id}`, payload);
        setItems((prev) =>
          prev.map((p) => (p.id === form.id ? payload : p))
        );
      } else {
        // create
        const payload = { ...form, price: +form.price };
        const { data } = await api.post('/products', payload);
        setItems((prev) => [...prev, data]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const editProduct = (prod) => setForm({ ...prod });

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setBusy(true);
    try {
      await api.delete(`/products/${id}`);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  /* ─────────────────────────
     Load on mount
  ──────────────────────────*/
  useEffect(() => { fetchProducts(); }, []);

  /* ─────────────────────────
     Render
  ──────────────────────────*/
  return (
    <>
      <h2>Products &amp; Services</h2>

      <form onSubmit={saveProduct} className="product-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit" disabled={busy}>
          {form.id ? 'Update' : 'Add'}
        </button>
        {form.id && (
          <button type="button" onClick={resetForm} disabled={busy}>
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {busy && !items.length && <p>Loading…</p>}

      {items.length > 0 && (
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: 120 }}>Price ($)</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>
                  <button onClick={() => editProduct(p)} disabled={busy}>
                    Edit
                  </button>{' '}
                  <button onClick={() => deleteProduct(p.id)} disabled={busy}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
