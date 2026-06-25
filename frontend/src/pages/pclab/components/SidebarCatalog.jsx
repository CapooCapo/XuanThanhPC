import React, { useState, useEffect } from 'react';
import { usePCBuilderStore } from '@/store/usePCBuilderStore';
import { apiClient } from '@/services/apiClient';
import { buildLabMockData } from '@/data/buildLabMockData';
import './SidebarCatalog.scss';

const CATEGORIES = ['CPU', 'GPU', 'Motherboard', 'RAM', 'SSD', 'HDD', 'PSU', 'Cooler', 'Case', 'Fan'];

const SidebarCatalog = () => {
  const [activeCategory, setActiveCategory] = useState('CPU');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDemoData, setIsDemoData] = useState(false);
  const { addComponent } = usePCBuilderStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setIsDemoData(false);
      try {
        const response = await apiClient.get(`/products/?category=${activeCategory.toLowerCase()}`);
        const data = response.data.results || response.data;
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          throw new Error('Empty response');
        }
      } catch (err) {
        console.warn(`Failed to fetch ${activeCategory} from API. Falling back to mock data.`);
        const fallbackKey = activeCategory.toLowerCase();
        setProducts(buildLabMockData[fallbackKey] || []);
        setIsDemoData(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="sidebar-catalog">
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="search-filter">
        <input type="text" placeholder={`Search ${activeCategory}...`} />
        {isDemoData && (
          <div className="demo-badge" style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px', textAlign: 'center' }}>
            ⚠️ Using offline demo data
          </div>
        )}
      </div>

      <div className="product-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">No products found</div>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.main_image || '/placeholder.png'} alt={product.name} />
              <div className="info">
                <h4>{product.name}</h4>
                <p className="price">{product.price.toLocaleString('vi-VN')} đ</p>
                <button 
                  onClick={() => addComponent(activeCategory.toLowerCase(), product)}
                  className="add-btn"
                >
                  Add
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarCatalog;
