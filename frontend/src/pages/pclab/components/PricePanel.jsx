import React from 'react';
import { usePCBuilderStore } from '@/store/usePCBuilderStore';

const PricePanel = () => {
  const { metrics } = usePCBuilderStore();

  return (
    <div className="bottom-summary-card">
      <h3>Build Summary</h3>
      <div className="summary-row">
        <span>Total Cost:</span>
        <span className="price">
          {(metrics?.totalPrice || 0).toLocaleString('vi-VN')} đ
        </span>
      </div>
      <div className="summary-row">
        <span>Power Usage:</span>
        <span>{metrics?.totalPowerDraw || 0} W</span>
      </div>
      <button className="checkout-btn">Proceed to Checkout</button>
    </div>
  );
};

export default PricePanel;
