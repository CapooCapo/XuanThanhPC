import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import { getProducts } from '@/services/productService';
import './FeaturedPCSection.scss';

const FeaturedPCSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ limit: 4 });
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="featured-pcs">
      <div className="container">
        <h2 className="section-title">Sản Phẩm PC Nổi Bật</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải sản phẩm...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Không có sản phẩm nào.</div>
        ) : (
          <div className="featured-pcs__grid">
            {products.map(pc => <ProductCard key={pc.id} product={pc} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPCSection;
