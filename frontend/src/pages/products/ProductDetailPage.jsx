import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { apiClient } from '@/services/apiClient';
import './ProductDetailPage.scss';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiClient.get(`/products/${slug}/`);
        setProduct(res.data);
        setActiveImage(res.data.main_image);
      } catch (err) {
        console.error(err);
        setError('Không tìm thấy sản phẩm. Có thể sản phẩm đã bị xóa hoặc đường dẫn không đúng.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleQuantityChange = (type) => {
    if (type === 'inc' && quantity < (product?.stock || 0)) {
      setQuantity(q => q + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock < 1) return;
    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    setAddingToCart(false);
    
    if (result.success) {
      setAddSuccess(true);
      showToast('Đã thêm vào giỏ hàng', 'success');
      setTimeout(() => setAddSuccess(false), 3000);
    } else {
      showToast(result.error || 'Lỗi khi thêm vào giỏ hàng.', 'error');
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock < 1) return;
    setAddingToCart(true);
    const result = await addToCart(product.id, quantity);
    setAddingToCart(false);
    
    if (result.success) {
      navigate('/cart');
    } else {
      showToast(result.error || 'Lỗi khi thêm vào giỏ hàng.', 'error');
    }
  };

  if (loading) {
    return (
      <>
        <div className="product-detail-page skeleton-container">
          <div className="skeleton skeleton-gallery" />
          <div className="skeleton-info">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-price" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" />
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <div className="product-detail-page error-container">
          <h2>Oops!</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
      </>
    );
  }

  const galleryImages = (product.images || []).map(img => img.image);
  const allImages = [...new Set([product.main_image, ...galleryImages].filter(Boolean))];
  const displayPrice = product.discount_price || product.price;

  return (
    <>
      <div className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => navigate('/')}>Trang chủ</span> &gt; 
            <span onClick={() => navigate('/linh-kien-pc')}>Linh kiện PC</span> &gt; 
            {product.category?.name && <span onClick={() => navigate(`/linh-kien-pc?category=${product.category.slug}`)}>{product.category.name} &gt; </span>}
            <span className="current">{product.name}</span>
          </div>

          <div className="product-main">
            {/* Gallery */}
            <div className="product-gallery">
              <div className="main-image">
                <img src={activeImage} alt={product.name} />
              </div>
              {allImages.length > 1 && (
                <div className="thumbnail-list">
                  {allImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`thumb-item ${activeImage === img ? 'active' : ''}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img src={img} alt={`${product.name} - ${idx}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-meta">
                <span className="brand">Danh mục: <strong>{product.category?.name || 'Đang cập nhật'}</strong></span>
                <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                </span>
              </div>

              <div className="product-price-box">
                <span className="current-price">{Number(displayPrice).toLocaleString('vi-VN')} ₫</span>
                {product.discount_price && product.discount_price < product.price && (
                  <span className="original-price">{Number(product.price).toLocaleString('vi-VN')} ₫</span>
                )}
              </div>

              {product.short_description && (
                <div className="short-desc">
                  {product.short_description}
                </div>
              )}

              {/* Action Area */}
              <div className="action-area">
                <div className="quantity-selector">
                  <button onClick={() => handleQuantityChange('dec')} disabled={quantity <= 1 || product.stock < 1}>-</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => handleQuantityChange('inc')} disabled={quantity >= product.stock}>+</button>
                </div>
                
                <div className="action-buttons">
                  <button 
                    className={`add-to-cart-btn ${addSuccess ? 'success' : ''}`} 
                    onClick={handleAddToCart}
                    disabled={product.stock < 1 || addingToCart}
                  >
                    {addingToCart ? 'Đang thêm...' : addSuccess ? '✓ Đã thêm' : 'Thêm vào giỏ hàng'}
                  </button>
                  <button 
                    className="buy-now-btn" 
                    onClick={handleBuyNow}
                    disabled={product.stock < 1 || addingToCart}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="product-content">
            {/* Description */}
            <div className="description-section">
              <h2>Mô tả sản phẩm</h2>
              <div className="desc-content" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
            </div>

            {/* Specifications */}
            <div className="specifications-section">
              <h2>Thông số kỹ thuật</h2>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      // Handle both string and array (like the old mock data 'specs' array inside)
                      key !== 'specs' && (
                        <tr key={idx}>
                          <td className="spec-label">{key.toUpperCase()}</td>
                          <td className="spec-value">{val}</td>
                        </tr>
                      )
                    ))}
                    {product.specifications.specs && Array.isArray(product.specifications.specs) && product.specifications.specs.map((spec, idx) => (
                      <tr key={`list-${idx}`}>
                        <td colSpan="2" className="spec-value list-spec">• {spec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Chưa có thông số kỹ thuật.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
