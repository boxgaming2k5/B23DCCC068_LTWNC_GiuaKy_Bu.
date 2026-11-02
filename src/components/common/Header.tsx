import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../app/hooks';
import { BorrowedDrawer } from '../../features/books/components/BorrowedDrawer';
import { BookOpen, BarChart2, Sun, Moon, BookMarked, Radio } from 'lucide-react';

export const Header: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const borrowedBooks = useAppSelector((state) => state.books.borrowedBooks);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('vi-VN', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    };
    updateTime();
  }, []);

  const borrowedCount = borrowedBooks.length;
  const isMaxBorrowed = borrowedCount >= 3;

  return (
    <>
      <header className="app-header sci-header">
        <div className="header-inner container">
          {/* Logo Khoa Học Vector Siêu Nét */}
          <Link to="/" className="brand-logo" title="Cổng Thông Tin Học Thuật & Nghiên Cứu">
            <div className="quantum-logo-wrapper">
              <svg
                className="quantum-logo-svg"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <linearGradient id="inner-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {/* Lục giác nguyên tử bảo hộ bên ngoài */}
                <polygon
                  points="22,3 39,12 39,32 22,41 5,32 5,12"
                  stroke="url(#cyber-grad)"
                  strokeWidth="2.2"
                  fill="url(#inner-glow)"
                />
                {/* Cuốn sách tri thức lượng tử mở */}
                <path
                  d="M13 18L22 22L31 18M22 22V33M13 23L22 27L31 23"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Hạt nhân năng lượng trung tâm */}
                <circle cx="22" cy="22" r="2.2" fill="#38bdf8" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title-row">
                <span className="brand-title">Mini Library</span>
                <span className="brand-version-pill">v2.5 Sci</span>
              </div>
              <span className="brand-tag">Academic Knowledge & Research Portal</span>
            </div>
          </Link>

          {/* Trạng thái hệ thống thời gian thực */}
          <div className="header-status-indicator" title="Máy chủ dữ liệu mục lục trực tuyến">
            <span className="system-online-badge">
              <Radio size={13} className="pulse-icon" />
              <span>Node Online</span>
            </span>
            {currentTime && <span className="current-date-tag">{currentTime}</span>}
          </div>

          {/* Navigation Links */}
          <nav className="header-nav" aria-label="Điều hướng chính">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              <BookOpen size={16} />
              <span>Tra Cứu Mục Lục</span>
            </NavLink>

            <NavLink
              to="/stats"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <BarChart2 size={16} />
              <span>Báo Cáo Thống Kê</span>
            </NavLink>
          </nav>

          {/* Actions: Thẻ Mượn & Chuyển Theme */}
          <div className="header-actions">
            {/* Nút mở giỏ sách đang mượn */}
            <button
              type="button"
              className={`btn-borrowed-badge ${isMaxBorrowed ? 'badge-limit' : ''}`}
              onClick={() => setIsDrawerOpen(true)}
              title="Xem danh sách tài liệu đang mượn và trả sách"
              aria-label={`Xem sách đang mượn, hiện có ${borrowedCount} trên 3 cuốn`}
            >
              <BookMarked size={17} />
              <span className="borrowed-text">Đang mượn:</span>
              <span className="borrowed-count">{borrowedCount}/3</span>
            </button>

            {/* Nút chuyển theme Sáng / Tối */}
            <button
              type="button"
              className="btn-theme-toggle"
              onClick={toggleTheme}
              title={`Chuyển sang giao diện ${isDark ? 'Sáng' : 'Tối'}`}
              aria-label="Chuyển đổi giao diện sáng tối"
            >
              {isDark ? (
                <Sun size={18} className="theme-icon sun-icon" />
              ) : (
                <Moon size={18} className="theme-icon moon-icon" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer xem sách đang mượn */}
      <BorrowedDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
