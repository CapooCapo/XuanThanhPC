import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '@/services/productService';
import './ComponentGridSection.scss';

const ComponentGridSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Assuming data is an array of objects with name and slug
        setCategories(data.slice(0, 8)); // Show max 8 categories
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="components">
      <div className="container">
        <h2 className="section-title">Linh Kiện Nổi Bật</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải danh mục...</div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Không có danh mục nào.</div>
        ) : (
          <div className="components__grid">
            {categories.map((cat, idx) => (
              <Link 
                to={`/linh-kien-pc?category=${cat.slug || cat.name || cat}`} 
                key={idx} 
                className="components__item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h4>{cat.name || cat}</h4>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ComponentGridSection;
