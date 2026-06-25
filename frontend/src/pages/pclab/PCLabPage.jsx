import React, { Suspense } from 'react';
import SidebarCatalog from './components/SidebarCatalog';
import DetailsPanel from './components/DetailsPanel';
import PerformanceWidget from './components/PerformanceWidget';
import Scene3D from './components/Scene3D';
import PricePanel from './components/PricePanel';
import { usePCBuilderStore } from '@/store/usePCBuilderStore';
import { sampleBuilds, buildLabMockData } from '@/data/buildLabMockData';
import { Link } from 'react-router-dom';
import './PCLabPage.scss';

const PCLabPage = () => {
  const { metrics, resetBuilder, loadPreset } = usePCBuilderStore();

  const handleLoadPreset = (e) => {
    const presetId = e.target.value;
    if (!presetId) return;

    const preset = sampleBuilds.find(p => p.id === presetId);
    if (!preset) return;

    const resolveComponent = (category, id) => buildLabMockData[category]?.find(c => c.id === id) || null;
    const resolveMultiple = (category, ids) => (ids || []).map(id => resolveComponent(category, id)).filter(Boolean);

    const mappedComponents = {
      cpu: resolveComponent('cpu', preset.components.cpu),
      motherboard: resolveComponent('motherboard', preset.components.motherboard),
      gpu: resolveComponent('gpu', preset.components.gpu),
      psu: resolveComponent('psu', preset.components.psu),
      case: resolveComponent('case', preset.components.case),
      cooler: resolveComponent('cooler', preset.components.cooler),
      ram: resolveMultiple('ram', preset.components.ram),
      ssd: resolveMultiple('ssd', preset.components.ssd),
      hdd: resolveMultiple('hdd', preset.components.hdd),
      fans: resolveMultiple('fan', preset.components.fans),
    };

    loadPreset(mappedComponents);
    e.target.value = ''; // reset dropdown
  };

  return (
    <div className="pc-lab-wrapper">
      {/* Top Header Breadcrumbs */}
      <div className="lab-header">
        <div className="breadcrumbs">
          <Link to="/">Trang chủ</Link>
          <span className="separator">/</span>
          <span className="current">Build Lab 3D</span>
        </div>
        <div className="lab-actions">
          <select onChange={handleLoadPreset} className="preset-select" defaultValue="">
            <option value="" disabled>Load Preset Build...</option>
            {sampleBuilds.map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </select>
          <button className="btn-secondary" onClick={resetBuilder}>Reset Build</button>
          <button className="btn-primary">Lưu cấu hình</button>
        </div>
      </div>

      <div className="pc-lab-container">
        {/* Left Panel: Categories and Product List */}
        <SidebarCatalog />

        {/* Center 3D View */}
        <div className="center-view">
          <Suspense fallback={<div className="loading-3d">Đang tải môi trường 3D...</div>}>
            <Scene3D />
          </Suspense>
        </div>

        {/* Right Panel: unified details, performance, and price */}
        <div className="right-panel">
          {metrics.warnings && metrics.warnings.length > 0 && (
            <div className="warnings-container" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px' }}>
              <h4 style={{ color: '#ef4444', margin: '0 0 8px 0', fontSize: '0.9rem' }}>⚠️ Lưu ý tương thích</h4>
              <ul style={{ margin: 0, paddingLeft: '16px', color: '#fca5a5', fontSize: '0.85rem' }}>
                {metrics.warnings.map((warn, i) => <li key={i} style={{ marginBottom: '4px' }}>{warn}</li>)}
              </ul>
            </div>
          )}
          <PerformanceWidget />
          <DetailsPanel />
          <PricePanel />
        </div>
      </div>
    </div>
  );
};

export default PCLabPage;
