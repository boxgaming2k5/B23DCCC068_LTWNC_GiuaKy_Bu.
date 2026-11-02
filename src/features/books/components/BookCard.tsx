import React from 'react';
import { Book } from '../../../types/book';
import {
  BookOpen,
  Calendar,
  User,
  CheckCircle2,
  BookmarkX,
  RotateCcw,
  MapPin,
  Fingerprint,
  Compass,
} from 'lucide-react';

export interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  canBorrowMore?: boolean;
}

/**
 * Buổi 5: Tối ưu hiệu năng - Component BookCard bọc React.memo
 * Thiết kế theo Thẻ Mục Lục Nghiên Cứu Quốc Tế (Academic Scientific Specimen)
 */
export const BookCard: React.FC<BookCardProps> = React.memo(
  ({ book, isBorrowed, onBorrow, onReturn, canBorrowMore = true }) => {
    const isOutOfStock = book.availableCopies <= 0;

    const availabilityPercent = Math.round(
      (book.availableCopies / (book.totalCopies || 1)) * 100
    );

    const shelfLocations: Record<string, string> = {
      'b-001': 'Kệ IT-01 (Khu A)',
      'b-002': 'Kệ IT-02 (Khu A)',
      'b-003': 'Kệ IT-03 (Khu A)',
      'b-004': 'Kệ IT-04 (Khu A)',
      'b-005': 'Kệ IT-05 (Khu A)',
      'b-006': 'Kệ KT-01 (Khu B)',
      'b-007': 'Kệ KT-02 (Khu B)',
      'b-008': 'Kệ KT-03 (Khu B)',
      'b-009': 'Kệ KT-04 (Khu B)',
      'b-010': 'Kệ NN-01 (Khu C)',
      'b-011': 'Kệ NN-02 (Khu C)',
      'b-012': 'Kệ NN-03 (Khu C)',
    };

    const shelf = shelfLocations[book.id] || 'Kệ TT-Khoa';

    return (
      <article
        data-testid={`book-card-${book.id}`}
        className={`book-card sci-specimen-card ${isBorrowed ? 'borrowed-card' : ''} ${
          isOutOfStock ? 'card-depleted' : ''
        }`}
      >
        {/* Thanh phân loại khoa học trên đỉnh */}
        <div className="sci-specimen-top-strip">
          <div className="specimen-id-group">
            <span className="specimen-code">
              <Fingerprint size={12} className="inline-icon" />
              {book.id.toUpperCase()}
            </span>
            {book.ddc && (
              <span className="ddc-badge" title="Mã phân loại thập phân Dewey (DDC)">
                DDC {book.ddc}
              </span>
            )}
          </div>

          <div className="specimen-tags-right">
            <span className={`genre-badge genre-${book.genre}`}>
              {book.genre}
            </span>
            <span className="published-year" title="Năm xuất bản">
              <Calendar size={12} className="inline-icon" />
              {book.publishedYear}
            </span>
          </div>
        </div>

        {/* Thân thẻ tài liệu */}
        <div className="book-card-body">
          <h3 className="book-title" title={book.title}>
            {book.title}
          </h3>

          <div className="meta-row author-row">
            <User size={13} className="inline-icon" />
            <span className="book-author">
              Tác giả: <strong>{book.author}</strong>
            </span>
          </div>

          <div className="meta-row location-row">
            <span className="location-item">
              <MapPin size={12} className="inline-icon text-accent" />
              {shelf}
            </span>
            {book.doi && (
              <span className="doi-item" title="Digital Object Identifier">
                <Compass size={11} className="inline-icon" />
                DOI: {book.doi}
              </span>
            )}
          </div>

          {book.description && (
            <p className="book-description" title={book.description}>
              {book.description}
            </p>
          )}

          {/* Thanh đo mức độ khả dụng thiết kế dạng thước đo khoa học */}
          <div className="sci-gauge-box">
            <div className="gauge-header">
              <span className="gauge-caption">Trạng thái khả dụng lưu kho:</span>
              <span className={`gauge-status-val ${isOutOfStock ? 'val-depleted' : ''}`}>
                {isOutOfStock ? 'Hết tài liệu (0%)' : `${availabilityPercent}% Sẵn sàng`}
              </span>
            </div>
            <div className="gauge-segments-track">
              <div
                className={`gauge-fill-bar ${
                  isOutOfStock ? 'gauge-empty' : availabilityPercent < 35 ? 'gauge-low' : 'gauge-full'
                }`}
                style={{ width: `${availabilityPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Chân thẻ: Số bản & Nút thao tác */}
        <div className="book-card-footer">
          <div className="copies-info">
            <span className="copies-label">Số bản còn lại:</span>
            <span
              className={`copies-badge ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}
              data-testid={`copies-${book.id}`}
            >
              <strong>{book.availableCopies}</strong> / {book.totalCopies}
            </span>
          </div>

          <div className="action-buttons">
            {isBorrowed ? (
              <div className="borrowed-action-group">
                <span className="status-borrowed-pill">
                  <CheckCircle2 size={16} /> Đang mượn
                </span>
                <button
                  type="button"
                  data-testid={`return-btn-${book.id}`}
                  className="btn btn-return"
                  onClick={() => onReturn(book.id)}
                  title="Trả cuốn sách này lại thư viện"
                >
                  <RotateCcw size={15} />
                  Trả sách
                </button>
              </div>
            ) : (
              <button
                type="button"
                data-testid={`borrow-btn-${book.id}`}
                className={`btn btn-borrow ${isOutOfStock ? 'btn-disabled' : ''}`}
                onClick={() => onBorrow(book.id)}
                disabled={isOutOfStock}
                title={
                  isOutOfStock
                    ? 'Sách hiện đã hết bản mượn'
                    : !canBorrowMore
                    ? 'Bạn đã đạt giới hạn 3 cuốn sách'
                    : 'Mượn cuốn sách này'
                }
              >
                {isOutOfStock ? (
                  <>
                    <BookmarkX size={16} />
                    Hết sách
                  </>
                ) : (
                  <>
                    <BookOpen size={16} />
                    Mượn sách
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }
);

BookCard.displayName = 'BookCard';
