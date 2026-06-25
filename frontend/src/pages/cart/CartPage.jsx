import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import './CartPage.scss';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, isCartLoading, updateQuantity, removeFromCart, cartTotal, totalItems } = useCart();

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = (itemId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      removeFromCart(itemId);
    }
  };

  if (isCartLoading) {
    return (
      <>
        <div className="cart-page loading-state">
          <div className="container">
            <h2>Đang tải giỏ hàng...</h2>
          </div>
        </div>
      </>
    );
  }

  const items = cart?.items || [];
  const shippingFee = items.length > 0 ? 0 : 0; // Free shipping for now
  const finalTotal = cartTotal + shippingFee;

  return (
    <>
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Giỏ hàng của bạn ({totalItems} sản phẩm)</h1>

          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h2>Giỏ hàng trống</h2>
              <p>Không có sản phẩm nào trong giỏ hàng của bạn.</p>
              <button className="continue-btn" onClick={() => navigate('/')}>
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="cart-content">
              {/* Left Side: Item List */}
              <div className="cart-items">
                <div className="items-header">
                  <div className="col-product">Sản phẩm</div>
                  <div className="col-price">Đơn giá</div>
                  <div className="col-quantity">Số lượng</div>
                  <div className="col-subtotal">Thành tiền</div>
                  <div className="col-action"></div>
                </div>

                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="col-product">
                      <img 
                        src={item.product_details?.main_image || '/placeholder.png'} 
                        alt={item.product_details?.name || 'Sản phẩm'} 
                        className="item-img"
                        onClick={() => item.product_details?.slug && navigate(`/products/${item.product_details.slug}`)}
                        style={{ cursor: item.product_details?.slug ? 'pointer' : 'default' }}
                      />
                      <div className="item-info">
                        <h3 
                          className="item-name"
                          onClick={() => item.product_details?.slug && navigate(`/products/${item.product_details.slug}`)}
                          style={{ cursor: item.product_details?.slug ? 'pointer' : 'default' }}
                        >
                          {item.product_details?.name || 'Đang tải...'}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="col-price">
                      {parseFloat(item.unit_price).toLocaleString('vi-VN')} ₫
                    </div>

                    <div className="col-quantity">
                      <div className="quantity-controls">
                        <button onClick={() => handleQuantityChange(item, item.quantity - 1)}>-</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button onClick={() => handleQuantityChange(item, item.quantity + 1)}>+</button>
                      </div>
                    </div>

                    <div className="col-subtotal">
                      {parseFloat(item.subtotal).toLocaleString('vi-VN')} ₫
                    </div>

                    <div className="col-action">
                      <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Order Summary */}
              <div className="cart-summary">
                <h2>Tóm tắt đơn hàng</h2>
                
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>{parseFloat(cartTotal).toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="summary-row">
                  <span>Phí giao hàng</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} ₫`}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Tổng cộng</span>
                  <span className="total-price">{parseFloat(finalTotal).toLocaleString('vi-VN')} ₫</span>
                </div>

                <p className="vat-note">(Đã bao gồm VAT nếu có)</p>

                <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                  Tiến hành thanh toán
                </button>
                <button className="continue-shopping-btn" onClick={() => navigate('/build-pc')}>
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
