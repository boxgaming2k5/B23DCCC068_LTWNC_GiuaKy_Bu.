import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchBooks, borrowBook, returnBook } from '../booksSlice';
import { useBooksFilter } from '../../../hooks/useBooksFilter';
import { BookCard } from './BookCard';
import { FilterBar } from './FilterBar';
import { Book, BorrowRecord } from '../../../types/book';
import {
  RefreshCw,
  AlertTriangle,
  BookX,
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';

export const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, status, error, borrowedBooks } = useAppSelector((state) => state.books);
  const { filteredBooks, debouncedQuery, selectedGenre, isFiltering, totalBooks, filteredCount } =
    useBooksFilter();

  // Chế độ sắp xếp khoa học
  const [sortBy, setSortBy] = useState<'default' | 'year-desc' | 'copies-desc'>('default');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Khởi động lấy danh sách sách từ API giả lập khi app mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks(false));
    }
  }, [dispatch, status]);

  // Buổi 5: Tối ưu hiệu năng - Các handler truyền xuống component con được bọc useCallback
  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    dispatch(fetchBooks(false));
  }, [dispatch]);

  const handleSimulateError = useCallback(() => {
    dispatch(fetchBooks(true));
  }, [dispatch]);

  // Tập hợp các ID sách đang mượn để tra cứu O(1)
  const borrowedBookIdSet = useMemo(() => {
    return new Set(borrowedBooks.map((b: BorrowRecord) => b.bookId));
  }, [borrowedBooks]);

  const canBorrowMore = borrowedBooks.length < 3;

  // Tổng hợp thống kê nhanh cho Scientific Metric Strip
  const totalCopies = useMemo(() => books.reduce((sum: number, b: Book) => sum + b.totalCopies, 0), [books]);
  const availableCopiesTotal = useMemo(() => books.reduce((sum: number, b: Book) => sum + b.availableCopies, 0), [books]);

  // Áp dụng sắp xếp và lọc bổ sung
  const displayedBooks = useMemo(() => {
    let result = [...filteredBooks];

    if (onlyAvailable) {
      result = result.filter((b) => b.availableCopies > 0);
    }

    if (sortBy === 'year-desc') {
      result.sort((a, b) => b.publishedYear - a.publishedYear);
    } else if (sortBy === 'copies-desc') {
      result.sort((a, b) => b.availableCopies - a.availableCopies);
    }

    return result;
  }, [filteredBooks, onlyAvailable, sortBy]);

  return (
    <div className="book-list-container">
      {/* Banner & Scientific Metric Strip */}
      <section className="academic-portal-hero">
        <div className="hero-top-row">
          <div>
            <div className="hero-badge">
              <Sparkles size={14} className="inline-icon" />
              CỔNG THÔNG TIN HỌC THUẬT & TÀI LIỆU KHOA HỌC
            </div>
            <h1 className="catalog-title">Tra Cứu Mục Lục Thư Viện</h1>
            <p className="catalog-subtitle">
              Hệ thống quản lý tài liệu chuyên ngành khoa CNTT - Kinh tế - Ngoại ngữ
            </p>
          </div>

          <div className="api-test-tools">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleRetry}
              disabled={status === 'loading'}
              title="Đồng bộ lại danh mục từ API giả lập (delay 500ms)"
            >
              <RefreshCw size={14} className={status === 'loading' ? 'spin' : ''} />
              Đồng bộ dữ liệu
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleSimulateError}
              disabled={status === 'loading'}
              title="Kiểm thử trường hợp API phản hồi mã lỗi { ok: false, error }"
            >
              <AlertTriangle size={14} />
              Test API Lỗi
            </button>
          </div>
        </div>

        {/* Thanh chỉ số khoa học (Scientific Metrics Strip) */}
        <div className="scientific-metrics-strip">
          <div className="metric-cell">
            <div className="metric-icon metric-icon-primary">
              <Layers size={18} />
            </div>
            <div className="metric-data">
              <span className="metric-number">{totalBooks}</span>
              <span className="metric-label">Đầu mục tài liệu</span>
            </div>
          </div>

          <div className="metric-cell">
            <div className="metric-icon metric-icon-success">
              <BookOpen size={18} />
            </div>
            <div className="metric-data">
              <span className="metric-number">{availableCopiesTotal}</span>
              <span className="metric-label">Bản khả dụng / {totalCopies} tổng</span>
            </div>
          </div>

          <div className="metric-cell">
            <div className="metric-icon metric-icon-warning">
              <Clock size={18} />
            </div>
            <div className="metric-data">
              <span className="metric-number">{borrowedBooks.length} / 3</span>
              <span className="metric-label">Hạn mức thẻ sinh viên</span>
            </div>
          </div>

          <div className="metric-cell">
            <div className="metric-icon metric-icon-info">
              <CheckCircle2 size={18} />
            </div>
            <div className="metric-data">
              <span className="metric-number">
                {totalCopies > 0 ? Math.round((availableCopiesTotal / totalCopies) * 100) : 0}%
              </span>
              <span className="metric-label">Tỷ lệ lưu trữ sẵn sàng</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bảng điều khiển tra cứu */}
      <FilterBar />

      {/* Thanh công cụ quản lý hiển thị và sắp xếp */}
      <div className="catalog-toolbar">
        <div className="toolbar-left">
          <span className="results-count-text">
            Tìm thấy <strong>{displayedBooks.length}</strong> kết quả
            {isFiltering && (
              <span className="active-filter-indicator">
                (Đang lọc: {selectedGenre !== 'All' ? `Chuyên ngành: ${selectedGenre}` : ''}
                {debouncedQuery ? ` | Từ khóa: "${debouncedQuery}"` : ''})
              </span>
            )}
          </span>
        </div>

        <div className="toolbar-right">
          {/* Lọc chỉ hiện sách còn bản */}
          <label className="checkbox-toggle-label">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <span>Chỉ hiện sách còn bản</span>
          </label>

          {/* Sắp xếp tài liệu */}
          <div className="sort-select-wrapper">
            <ArrowUpDown size={14} className="sort-icon" />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sắp xếp danh mục tài liệu"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="year-desc">Năm xuất bản: Mới nhất</option>
              <option value="copies-desc">Bản khả dụng: Nhiều nhất</option>
            </select>
          </div>

          {/* Chuyển chế độ xem Grid / Compact */}
          <div className="view-mode-toggle" role="group" aria-label="Chế độ hiển thị">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Chế độ xem dạng lưới thẻ tài liệu"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => setViewMode('compact')}
              title="Chế độ xem danh sách mục lục gọn"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Trạng thái 1: Đang tải */}
      {status === 'loading' && (
        <div className="state-card loading-state" role="status" aria-live="polite">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải...</p>
          <span className="loading-subtext">Đang kết nối cơ sở dữ liệu mục lục thư viện (giả lập 500ms)...</span>
        </div>
      )}

      {/* Trạng thái 2: Lỗi tải API */}
      {status === 'failed' && (
        <div className="state-card error-state" role="alert">
          <AlertTriangle className="error-icon" size={48} />
          <h3 className="error-title">Không thể tải danh sách sách</h3>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRetry}
            >
              <RefreshCw size={16} /> Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Trạng thái 3: Tải thành công */}
      {status === 'succeeded' && (
        <>
          {displayedBooks.length === 0 ? (
            <div className="state-card empty-state">
              <BookX className="empty-icon" size={48} />
              <h3 className="empty-title">Không tìm thấy tài liệu phù hợp</h3>
              <p className="empty-message">
                Không tìm thấy tài liệu nào khớp với điều kiện tra cứu "{debouncedQuery}". Hãy thử từ khóa khác hoặc đặt lại bộ lọc.
              </p>
            </div>
          ) : (
            <div className={`books-grid ${viewMode === 'compact' ? 'compact-layout' : ''}`}>
              {/* Buổi 5: Key KHÔNG DÙNG index, sử dụng book.id duy nhất */}
              {displayedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isBorrowed={borrowedBookIdSet.has(book.id)}
                  canBorrowMore={canBorrowMore}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
