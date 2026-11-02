import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { BookList } from './features/books/components/BookList';
import { StatsSkeleton } from './components/common/StatsSkeleton';

// Buổi 5: Tối ưu hiệu năng - Trang Thống Kê được lazy load bằng React.lazy
const StatsPage = React.lazy(() => import('./features/stats/StatsPage'));

export const App: React.FC = () => {
  return (
    <div className="app-root">
      {/* Thông báo Toast toàn cục */}
      <NotificationToast />

      {/* Header thanh điều hướng */}
      <Header />

      {/* Nội dung chính điều hướng theo Routes */}
      <main className="main-content container">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route
            path="/stats"
            element={
              // Buổi 5: Bọc Suspense khi lazy load component
              <Suspense fallback={<StatsSkeleton />}>
                <StatsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-inner">
          <p>
            <strong>Mini Library</strong> — Hệ thống Quản lý Mượn/Trả Sách Thư Viện Khoa
          </p>
          <p className="footer-credits">
            Đồ án Kiểm Tra Giữa Kỳ Lập Trình Web Nâng Cao • React 18 • TypeScript • Redux Toolkit • Zustand
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

