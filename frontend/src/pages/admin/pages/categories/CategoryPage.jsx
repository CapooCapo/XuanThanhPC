import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import DataTable from '@/pages/admin/components/DataTable';
import Modal from '@/pages/admin/components/Modal';
import { useToast } from '@/contexts/ToastContext';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/categories/');
      setCategories(res.data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      showToast('Failed to load categories', 'error');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await adminApi.delete(`/categories/${id}/`);
        showToast('Category deleted', 'success');
        fetchCategories();
      } catch (e) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminApi.patch(`/categories/${editingCategory.id}/`, formData);
        showToast('Category updated', 'success');
      } else {
        await adminApi.post('/categories/', formData);
        showToast('Category created', 'success');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (e) {
      showToast('Failed to save category', 'error');
    }
  };

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Slug', key: 'slug' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Category Management</h2>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({ name: '', slug: '' }); setIsModalOpen(true); }} 
          style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add New Category
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={categories} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            placeholder="Category Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
            style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          />
          <input 
            placeholder="Slug" 
            value={formData.slug} 
            onChange={e => setFormData({...formData, slug: e.target.value})} 
            required 
            style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          />
          <button type="submit" style={{ padding: '10px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
