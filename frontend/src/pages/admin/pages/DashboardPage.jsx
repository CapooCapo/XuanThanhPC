import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.get('/dashboard/')
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to load dashboard stats", err));
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="value">${stats.total_revenue}</div>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="value">{stats.total_orders}</div>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="value">{stats.total_users}</div>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="value">{stats.total_products}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="data-table-container">
          <h3 style={{ padding: '15px', margin: 0, borderBottom: '1px solid #e2e8f0' }}>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.status}</td>
                  <td>${order.total_price}</td>
                </tr>
              ))}
              {stats.recent_orders.length === 0 && <tr><td colSpan="3">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="data-table-container">
          <h3 style={{ padding: '15px', margin: 0, borderBottom: '1px solid #e2e8f0' }}>Low Stock Products</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {stats.low_stock_products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td style={{ color: 'red', fontWeight: 'bold' }}>{product.stock}</td>
                  <td>${product.price}</td>
                </tr>
              ))}
              {stats.low_stock_products.length === 0 && <tr><td colSpan="3">No low stock products.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
