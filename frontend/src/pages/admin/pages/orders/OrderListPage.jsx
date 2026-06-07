import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import DataTable from '@/pages/admin/components/DataTable';
import Modal from '@/pages/admin/components/Modal';
import { useToast } from '@/contexts/ToastContext';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [status, setStatus] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.get('/orders/');
      setOrders(res.data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      showToast('Failed to load orders', 'error');
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setStatus(order.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.patch(`/orders/${editingOrder.id}/`, { status });
      showToast('Order status updated', 'success');
      setIsModalOpen(false);
      fetchOrders();
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const columns = [
    { label: 'Order #', key: 'order_number' },
    { label: 'Customer', key: 'full_name' },
    { label: 'Total', key: 'total_price', render: (row) => `$${row.total_price}` },
    { label: 'Status', key: 'status', render: (row) => (
      <span style={{ 
        padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold',
        background: row.status === 'completed' ? '#dcfce7' : row.status === 'pending' ? '#fef3c7' : '#e0f2fe',
        color: row.status === 'completed' ? '#166534' : row.status === 'pending' ? '#92400e' : '#075985'
      }}>
        {row.status.toUpperCase()}
      </span>
    )}
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Order Management</h2>

      <DataTable 
        columns={columns} 
        data={orders} 
        onEdit={handleEdit} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Order Status">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Order:</strong> {editingOrder?.order_number}
          </div>
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)} 
            required 
            style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipping">Shipping</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button type="submit" style={{ padding: '10px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Update Status
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default OrderListPage;
