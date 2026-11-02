import React, { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { Book, BorrowRecord, BookGenre, GenreCountRecord } from '../../types/book';
import { BarChart3, BookOpen, Layers, CheckCircle2, BookmarkCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BorrowedDetailWithBook extends BorrowRecord {
  book?: Book;
}

/**
 * Buổi 5: Component trang Thống Kê được export default để hỗ trợ React.lazy + Suspense
 * Hiển thị số đầu sách theo từng thể loại và số sách đang mượn
 */
const StatsPage: React.FC = () => {
  const { books, borrowedBooks } = useAppSelector((state) => state.books);

  // Buổi 1: Ứng dụng Utility Type Record<BookGenre, number>
  const genreTitleCounts = useMemo<GenreCountRecord>(() => {
    const counts: GenreCountRecord = {
      CNTT: 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((b: Book) => {
      const g = b.genre;
      if (g in counts) {
        counts[g] += 1;
      }
    });

    return counts;
  }, [books]);

  // Thống kê tổng số bản sách theo thể loại
  const genreCopiesCounts = useMemo<Record<BookGenre, { available: number; total: number }>>(() => {
    const stats: Record<BookGenre, { available: number; total: number }> = {
      CNTT: { available: 0, total: 0 },
      'Kinh tế': { available: 0, total: 0 },
      'Ngoại ngữ': { available: 0, total: 0 },
    };

    books.forEach((b: Book) => {
      const g = b.genre;
      if (stats[g]) {
        stats[g].available += b.availableCopies;
        stats[g].total += b.totalCopies;
      }
    });

    return stats;
  }, [books]);

  // Danh sách chi tiết các cuốn đang mượn
  const borrowedBookDetails = useMemo<BorrowedDetailWithBook[]>(() => {
    return borrowedBooks.map((record: BorrowRecord) => {
      const book = books.find((b: Book) => b.id === record.bookId);
      return {
        ...record,
        book,
      };
    });
  }, [books, borrowedBooks]);

  const totalTitles = books.length;
  const totalCopies = books.reduce((sum: number, b: Book) => sum + b.totalCopies, 0);
  const totalAvailable = books.reduce((sum: number, b: Book) => sum + b.availableCopies, 0);
  const currentBorrowedCount = borrowedBooks.length;

  return (
    <div className="stats-container">
      {/* Header trang thống kê */}
      <div className="stats-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> Quay lại danh mục sách
        </Link>
        <div className="stats-title-group">
          <div className="stats-title-icon-wrapper">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="stats-page-title">Báo Cáo Thống Kê Thư Viện</h1>
            <p className="stats-page-subtitle">
              Tổng hợp dữ liệu đầu sách theo từng chuyên ngành và tình trạng mượn/trả của sinh viên
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-blue">
            <Layers size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng Số Đầu Sách</span>
            <span className="kpi-value">{totalTitles}</span>
            <span className="kpi-hint">3 chuyên ngành chính</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-emerald">
            <BookOpen size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng Bản Sách Trong Kho</span>
            <span className="kpi-value">{totalCopies}</span>
            <span className="kpi-hint">Còn lại: {totalAvailable} bản</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-purple">
            <BookmarkCheck size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Sách Bạn Đang Mượn</span>
            <span className="kpi-value">{currentBorrowedCount} / 3</span>
            <span className="kpi-hint">
              {currentBorrowedCount === 3
                ? 'Đã đạt giới hạn tối đa'
                : `Còn có thể mượn thêm ${3 - currentBorrowedCount} cuốn`}
            </span>
          </div>
        </div>
      </div>

      {/* Thống kê chi tiết theo thể loại */}
      <div className="stats-section">
        <h2 className="section-title">
          <Layers size={20} className="inline-icon" /> Số Đầu Sách Theo Từng Thể Loại
        </h2>

        <div className="genre-stats-grid">
          {/* Thể loại CNTT */}
          <div className="genre-stat-card cntt-card">
            <div className="genre-stat-header">
              <span className="genre-badge genre-cntt">CNTT</span>
              <span className="genre-title-count">
                <strong>{genreTitleCounts.CNTT}</strong> đầu sách
              </span>
            </div>
            <div className="genre-progress-bar-bg">
              <div
                className="genre-progress-bar fill-cntt"
                style={{
                  width: totalTitles > 0 ? `${(genreTitleCounts.CNTT / totalTitles) * 100}%` : '0%',
                }}
              ></div>
            </div>
            <div className="genre-copies-summary">
              <span>Còn lại: {genreCopiesCounts.CNTT.available} bản</span>
              <span>Tổng: {genreCopiesCounts.CNTT.total} bản</span>
            </div>
          </div>

          {/* Thể loại Kinh tế */}
          <div className="genre-stat-card kt-card">
            <div className="genre-stat-header">
              <span className="genre-badge genre-kt">Kinh tế</span>
              <span className="genre-title-count">
                <strong>{genreTitleCounts['Kinh tế']}</strong> đầu sách
              </span>
            </div>
            <div className="genre-progress-bar-bg">
              <div
                className="genre-progress-bar fill-kt"
                style={{
                  width: totalTitles > 0 ? `${(genreTitleCounts['Kinh tế'] / totalTitles) * 100}%` : '0%',
                }}
              ></div>
            </div>
            <div className="genre-copies-summary">
              <span>Còn lại: {genreCopiesCounts['Kinh tế'].available} bản</span>
              <span>Tổng: {genreCopiesCounts['Kinh tế'].total} bản</span>
            </div>
          </div>

          {/* Thể loại Ngoại ngữ */}
          <div className="genre-stat-card nn-card">
            <div className="genre-stat-header">
              <span className="genre-badge genre-nn">Ngoại ngữ</span>
              <span className="genre-title-count">
                <strong>{genreTitleCounts['Ngoại ngữ']}</strong> đầu sách
              </span>
            </div>
            <div className="genre-progress-bar-bg">
              <div
                className="genre-progress-bar fill-nn"
                style={{
                  width: totalTitles > 0 ? `${(genreTitleCounts['Ngoại ngữ'] / totalTitles) * 100}%` : '0%',
                }}
              ></div>
            </div>
            <div className="genre-copies-summary">
              <span>Còn lại: {genreCopiesCounts['Ngoại ngữ'].available} bản</span>
              <span>Tổng: {genreCopiesCounts['Ngoại ngữ'].total} bản</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách các cuốn đang mượn */}
      <div className="stats-section">
        <h2 className="section-title">
          <CheckCircle2 size={20} className="inline-icon" /> Chi Tiết Các Cuốn Sách Đang Mượn
        </h2>

        {borrowedBookDetails.length === 0 ? (
          <div className="empty-borrowed-box">
            <p>Hiện tại bạn không mượn cuốn sách nào từ thư viện.</p>
            <Link to="/" className="btn btn-primary btn-sm">
              Xem và mượn sách ngay
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Tên Sách</th>
                  <th>Tác Giả</th>
                  <th>Thể Loại</th>
                  <th>Ngày Mượn</th>
                  <th>Hạn Trả</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBookDetails.map((item: BorrowedDetailWithBook) => (
                  <tr key={item.bookId}>
                    <td>
                      <strong>{item.book?.title ?? item.bookId}</strong>
                    </td>
                    <td>{item.book?.author ?? 'N/A'}</td>
                    <td>
                      <span className="genre-pill-inline">{item.book?.genre}</span>
                    </td>
                    <td>{new Date(item.borrowedAt).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(item.dueDate).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className="status-badge-active">Đang mượn</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
