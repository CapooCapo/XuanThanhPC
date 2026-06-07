import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import DataTable from '@/pages/admin/components/DataTable';
import Modal from '@/pages/admin/components/Modal';
import { useToast } from '@/contexts/ToastContext';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', price: '', category: '', stock: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await adminApi.get('/products/');
      setProducts(res.data);
      setLoading(false);
    } catch (e) {
      showToast('Failed to load products', 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/categories/');
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await adminApi.delete(`/products/${id}/`);
        showToast('Product deleted', 'success');
        fetchProducts();
      } catch (e) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, slug: product.slug, price: product.price, 
      category: product.category, stock: product.stock, description: product.description
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('thumbnail', imageFile);

    try {
      if (editingProduct) {
        await adminApi.patch(`/products/${editingProduct.id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
        showToast('Product updated successfully', 'success');
      } else {
        await adminApi.post('/products/', data, { headers: { 'Content-Type': 'multipart/form-data' }});
        showToast('Product created successfully', 'success');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', slug: '', price: '', category: '', stock: '', description: '' });
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      showToast('Error saving product', 'error');
    }
  };

  const columns = [
    { label: 'Image', key: 'main_image', render: (row) => row.main_image ? <img src={row.main_image} alt={row.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /> : 'No image' },
    { label: 'Name', key: 'name' },
    { label: 'Stock', key: 'stock' },
    { label: 'Price', key: 'price', render: (row) => `${Number(row.price).toLocaleString('vi-VN')} ₫` }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Product Management</h2>
        <button 
          onClick={() => { setEditingProduct(null); setFormData({ name: '', slug: '', price: '', category: '', stock: '', description: '' }); setIsModalOpen(true); }} 
          style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add New Product
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={products} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}/>
          <input placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}/>
          <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}/>
          <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}/>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', minHeight: '100px' }}/>
          <input type="file" onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
          <button type="submit" style={{ background: '#0ea5e9', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>Save Product</button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductListPage;
