import React from 'react';

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="stats-container skeleton-container" role="status" aria-label="Đang tải dữ liệu thống kê">
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card skeleton-box"></div>
        <div className="kpi-card skeleton-box"></div>
        <div className="kpi-card skeleton-box"></div>
      </div>

      <div className="skeleton-section skeleton-box"></div>
    </div>
  );
};

