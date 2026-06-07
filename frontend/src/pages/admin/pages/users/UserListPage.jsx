import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import DataTable from '@/pages/admin/components/DataTable';
import { useToast } from '@/contexts/ToastContext';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.get('/users/');
      setUsers(res.data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      showToast('Failed to load users', 'error');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await adminApi.patch(`/users/${user.id}/`, { is_active: !user.is_active });
      showToast(`User ${user.is_active ? 'banned' : 'unbanned'}`, 'success');
      fetchUsers();
    } catch (e) {
      showToast('Failed to update user', 'error');
    }
  };

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Email', key: 'email' },
    { label: 'First Name', key: 'first_name' },
    { label: 'Last Name', key: 'last_name' },
    { label: 'Role', key: 'is_staff', render: (row) => row.is_staff ? <span style={{ color: '#0ea5e9', fontWeight: 'bold' }}>Admin</span> : 'User' },
    { label: 'Status', key: 'is_active', render: (row) => row.is_active ? <span style={{ color: '#16a34a' }}>Active</span> : <span style={{ color: '#ef4444' }}>Banned</span> }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>User Management</h2>

      <DataTable 
        columns={columns} 
        data={users} 
        onCustomAction={handleToggleActive}
        customActionLabel="Toggle Ban"
      />
    </div>
  );
};

export default UserListPage;
