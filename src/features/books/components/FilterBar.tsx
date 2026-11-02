import React from 'react';
import { useFilterStore } from '../../../store/useFilterStore';
import { FilterGenre } from '../../../types/book';
import { Search, X, SlidersHorizontal, Laptop, TrendingUp, Languages, Layers } from 'lucide-react';

const GENRES: { label: string; value: FilterGenre; icon: React.ReactNode; sub: string }[] = [
  { label: 'Tất cả', value: 'All', icon: <Layers size={14} />, sub: 'Toàn bộ danh mục' },
  { label: 'CNTT', value: 'CNTT', icon: <Laptop size={14} />, sub: 'Khoa học máy tính' },
  { label: 'Kinh tế', value: 'Kinh tế', icon: <TrendingUp size={14} />, sub: 'Tài chính & Quản trị' },
  { label: 'Ngoại ngữ', value: 'Ngoại ngữ', icon: <Languages size={14} />, sub: 'Ngôn ngữ ứng dụng' },
];

export const FilterBar: React.FC = () => {
  const { searchQuery, selectedGenre, setSearchQuery, setSelectedGenre, resetFilters } =
    useFilterStore();

  const isFiltering = searchQuery.trim().length > 0 || selectedGenre !== 'All';

  return (
    <section className="filter-console" aria-label="Bảng điều khiển tra cứu khoa học">
      {/* Hàng 1: Ô tìm kiếm chuẩn Command Bar */}
      <div className="search-console-row">
        <div className="search-box-wrapper">
          <Search className="search-icon" size={19} />
          <input
            type="text"
            className="search-input"
            placeholder="Tra cứu theo tên công trình, tác giả, chuyên ngành (không phân biệt hoa/thường)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Tìm kiếm sách"
          />
          {searchQuery ? (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Xóa từ khóa tìm kiếm"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X size={16} />
            </button>
          ) : (
            <span className="search-shortcut-badge" title="Phím tắt tìm kiếm">
              Ctrl + K
            </span>
          )}
        </div>
      </div>

      {/* Hàng 2: Bộ lọc thể loại phân vùng khoa học */}
      <div className="filter-controls-row">
        <div className="genre-segment-group" role="radiogroup" aria-label="Lọc theo thể loại chuyên ngành">
          <span className="segment-label">
            <SlidersHorizontal size={14} className="inline-icon" />
            Chuyên ngành:
          </span>

          <div className="segment-buttons">
            {GENRES.map(({ label, value, icon, sub }) => {
              const isActive = selectedGenre === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`segment-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(value)}
                  title={`${label} — ${sub}`}
                >
                  <span className="segment-icon">{icon}</span>
                  <span className="segment-text">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {isFiltering && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={resetFilters}
            title="Đặt lại toàn bộ bộ lọc"
          >
            <X size={13} className="inline-icon" /> Đặt lại bộ lọc
          </button>
        )}
      </div>
    </section>
  );
};
