import React from 'react';
import { usePCBuilderStore } from '@/store/usePCBuilderStore';
import './DetailsPanel.scss';

const DetailsPanel = () => {
  const { selectedComponents, metrics } = usePCBuilderStore();

  // If no components selected, it's technically compatible but empty.
  const hasComponents = Object.values(selectedComponents).some(c => c && (Array.isArray(c) ? c.length > 0 : true));

  return (
    <div className="details-panel">
      <h2>Build Compatibility</h2>
      
      <div className="status-badges">
        {!hasComponents ? (
          <div className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>ℹ️ Chọn linh kiện để kiểm tra</div>
        ) : metrics.warnings && metrics.warnings.length === 0 ? (
          <div className="badge success">✅ All parts compatible</div>
        ) : (
          <div className="badge error">❌ Compatibility Issues Detected</div>
        )}
      </div>

      <h3 className="section-title">Selected Parts</h3>
      <div className="parts-list">
        {Object.entries(selectedComponents).map(([type, comp]) => {
          if (!comp || (Array.isArray(comp) && comp.length === 0)) return null;

          if (Array.isArray(comp)) {
            return comp.map((c, i) => (
              <div key={`${type}-${i}`} className="part-item">
                <span className="type">{type.toUpperCase()} {i + 1}</span>
                <span className="name">{c.name}</span>
              </div>
            ));
          }

          return (
            <div key={type} className="part-item">
              <span className="type">{type.toUpperCase()}</span>
              <span className="name">{comp.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailsPanel;
