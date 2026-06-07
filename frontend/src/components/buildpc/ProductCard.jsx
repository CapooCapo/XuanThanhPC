import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import './ProductCard.scss';

const ProductCard = ({ product, isRecommended, recommendationReasons }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleCardClick = () => {
    // Navigate to product detail page if slug is available
    if (product.slug) {
      navigate(`/products/${product.slug}`);
    } else {
      // Fallback for mock data that might not have slug
      console.warn("Product slug missing", product);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!product.id) return;
    
    setAdding(true);
    const result = await addToCart(product.id, 1);
    setAdding(false);
    
    if (result.success) {
      setAdded(true);
      showToast('Đã thêm vào giỏ hàng', 'success');
      setTimeout(() => setAdded(false), 2000);
    } else {
      showToast(result.error || 'Lỗi thêm vào giỏ', 'error');
    }
  };

  // Support both backend format (main_image) and mock format (image)
  const imageUrl = product.main_image || product.image || '/placeholder.png';
  
  // Parse specifications depending on whether it's an array or object
  let displaySpecs = [];
  if (Array.isArray(product.specs)) {
    displaySpecs = product.specs.slice(0, 3);
  } else if (product.specifications && Object.keys(product.specifications).length > 0) {
    displaySpecs = Object.values(product.specifications).filter(val => typeof val === 'string').slice(0, 3);
  }

  const price = product.discount_price || product.price || 0;

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card-image-wrapper">
        {isRecommended && (
          <div className="recommendation-badge">
            <span className="star-icon">★</span> Phù hợp nhất
          </div>
        )}
        <img src={imageUrl} alt={product.name} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        
        {isRecommended && recommendationReasons && recommendationReasons.length > 0 && (
          <div className="recommendation-reasons">
            {recommendationReasons.map((reason, idx) => (
              <span key={idx} className="reason-tag">✓ {reason}</span>
            ))}
          </div>
        )}
        <ul className="card-specs">
          {displaySpecs.map((spec, index) => (
            <li key={index}>{spec}</li>
          ))}
        </ul>
        <div className="card-footer" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div className="card-price" style={{ width: '100%', marginBottom: '5px' }}>
            {Number(price).toLocaleString('vi-VN')} ₫
          </div>
          <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
            <button className="cta-button" style={{ flex: 1 }}>Chi tiết</button>
            <button 
              className="cta-button add-cart" 
              onClick={handleAddToCart}
              disabled={adding || product.stock < 1}
              style={{ 
                flex: 1, 
                backgroundColor: added ? '#16a34a' : 'transparent',
                color: added ? 'white' : '#19C37D',
                border: `1px solid ${added ? '#16a34a' : '#19C37D'}`,
                opacity: (adding || product.stock < 1) ? 0.6 : 1
              }}
            >
              {adding ? 'Đang thêm' : added ? '✓ Đã thêm' : '🛒 Mua'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
