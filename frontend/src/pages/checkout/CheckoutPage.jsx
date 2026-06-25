import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import './CheckoutPage.scss';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, totalItems, isCartLoading } = useCart();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    showToast('Chức năng thanh toán đang được phát triển!', 'error');
  };

  if (isCartLoading) {
    return (
      <>
        <div className="checkout-page loading-state">
          <div className="container">
            <h2>Đang tải thông tin...</h2>
          </div>
        </div>
      </>
    );
  }

  const items = cart?.items || [];
  if (items.length === 0) {
    return (
      <>
        <div className="checkout-page">
          <div className="container empty-checkout">
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
            <button className="back-btn" onClick={() => navigate('/')}>Quay lại mua sắm</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="container">
          <h1 className="page-title">Thanh toán</h1>
          
          <div className="checkout-content">
            <div className="checkout-form">
              <h2>Thông tin nhận hàng</h2>
              <form onSubmit={handleCheckout}>
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Nhập họ và tên" />
                </div>
                
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Nhập số điện thoại" />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Nhập email (không bắt buộc)" />
                </div>

                <div className="form-group">
                  <label>Địa chỉ nhận hàng *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="Nhập địa chỉ đầy đủ" />
                </div>

                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea name="note" value={formData.note} onChange={handleInputChange} placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)" rows="3"></textarea>
                </div>

                <div className="payment-method">
                  <h2>Phương thức thanh toán</h2>
                  <div className="payment-option">
                    <input type="radio" id="cod" name="payment" value="cod" defaultChecked />
                    <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                  </div>
                  <div className="payment-option disabled">
                    <input type="radio" id="bank" name="payment" value="bank" disabled />
                    <label htmlFor="bank">Chuyển khoản ngân hàng (Sắp ra mắt)</label>
                  </div>
                </div>

                <button type="submit" className="submit-btn">Xác nhận đặt hàng</button>
              </form>
            </div>

            <div className="order-summary">
              <h2>Đơn hàng của bạn ({totalItems} sản phẩm)</h2>
              <div className="items-list">
                {items.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="item-img-container">
                      <img src={item.product_details?.main_image || '/placeholder.png'} alt={item.product_details?.name} />
                      <span className="item-badge">{item.quantity}</span>
                    </div>
                    <div className="item-info">
                      <div className="item-name">{item.product_details?.name || 'Sản phẩm'}</div>
                      <div className="item-price">{parseFloat(item.subtotal).toLocaleString('vi-VN')} ₫</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="total-row">
                  <span>Tạm tính</span>
                  <span>{parseFloat(cartTotal).toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="total-row">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="total-row final">
                  <span>Tổng cộng</span>
                  <span className="final-price">{parseFloat(cartTotal).toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
