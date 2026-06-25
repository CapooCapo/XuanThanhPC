import React from 'react';
import { usePCBuilderStore } from '@/store/usePCBuilderStore';
import './PerformanceWidget.scss';

const PerformanceWidget = () => {
  const { metrics } = usePCBuilderStore();

  return (
    <div className="performance-widget">
      <h3>Predicted Performance</h3>
      <p className="subtitle">1080p Ultra Settings</p>

      {metrics.bottleneck && (
        <div className="bottleneck-alert">
          {metrics.bottleneck}
        </div>
      )}

      <div className="scores-grid">
        <div className="score-box">
          <span className="label">Gaming</span>
          <span className="value">{metrics.gamingScore}<span>/100</span></span>
        </div>
        <div className="score-box">
          <span className="label">Workstation</span>
          <span className="value">{metrics.productivityScore}<span>/100</span></span>
        </div>
      </div>

      <div className="fps-predictions">
        <div className="fps-row">
          <span>CS2</span>
          <span className="fps">{metrics.fpsPredictions?.['CS2'] || 0} FPS</span>
        </div>
        <div className="fps-row">
          <span>Valorant</span>
          <span className="fps">{metrics.fpsPredictions?.['Valorant'] || 0} FPS</span>
        </div>
        <div className="fps-row">
          <span>GTA V</span>
          <span className="fps">{metrics.fpsPredictions?.['GTA V'] || 0} FPS</span>
        </div>
        <div className="fps-row">
          <span>Cyberpunk 2077</span>
          <span className="fps">{metrics.fpsPredictions?.['Cyberpunk 2077'] || 0} FPS</span>
        </div>
        <div className="fps-row">
          <span>Black Myth: Wukong</span>
          <span className="fps">{metrics.fpsPredictions?.['Black Myth: Wukong'] || 0} FPS</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceWidget;
