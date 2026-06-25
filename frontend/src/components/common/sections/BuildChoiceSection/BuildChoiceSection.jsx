import React from 'react';
import { Link } from 'react-router-dom';
import './BuildChoiceSection.scss';

const BuildChoiceSection = () => {
  return (
    <section className="build-choice">
      <div className="container">
        <h2 className="section-title">Bạn muốn tự build PC hay chọn linh kiện?</h2>
        <div className="build-choice__grid">
          <Link to="/pc-lab" className="build-choice__card" style={{ textDecoration: 'none' }}>
            <h3>Tự Build PC Chuyên Nghiệp</h3>
            <p>Hệ thống tự động kiểm tra tương thích, giúp bạn an tâm lựa chọn cấu hình.</p>
          </Link>
          <Link to="/linh-kien-pc" className="build-choice__card" style={{ textDecoration: 'none' }}>
            <h3>Mua Sắm Linh Kiện Lẻ</h3>
            <p>Nâng cấp máy tính với kho linh kiện phong phú, giá ưu đãi mỗi ngày.</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BuildChoiceSection;
