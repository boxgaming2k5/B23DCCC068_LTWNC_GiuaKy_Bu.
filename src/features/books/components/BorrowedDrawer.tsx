import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { returnBook } from '../booksSlice';
import { BorrowRecord, Book } from '../../../types/book';
import { BookMarked, RotateCcw, AlertCircle, X, Calendar, BookOpen } from 'lucide-react';

interface BorrowedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BorrowedDetailItem {
  record: BorrowRecord;
  book: Book | undefined;
}

export const BorrowedDrawer: React.FC<BorrowedDrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { books, borrowedBooks } = useAppSelector((state) => state.books);

  if (!isOpen) return null;

  // Lấy chi tiết thông tin sách của từng lượt mượn
  const borrowedDetails: BorrowedDetailItem[] = borrowedBooks.map((record: BorrowRecord) => {
    const book = books.find((b: Book) => b.id === record.bookId);
    return {
      record,
      book,
    };
  });

  const handleReturn = (bookId: string) => {
    dispatch(returnBook(bookId));
  };

  const isFull = borrowedBooks.length >= 3;

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title-group">
            <BookMarked className="drawer-icon" size={24} />
            <div>
              <h2 className="drawer-title">Sách Đang Mượn</h2>
              <span className={`drawer-quota ${isFull ? 'quota-full' : ''}`}>
                Hạn mức: {borrowedBooks.length}/3 cuốn {isFull && '(Đã đạt tối đa)'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {isFull && (
            <div className="alert alert-warning" role="alert">
              <AlertCircle size={18} />
              <span>
                Bạn đã mượn tối đa 3 cuốn sách! Vui lòng trả bớt sách trước khi muốn mượn thêm cuốn khác.
              </span>
            </div>
          )}

          {borrowedDetails.length === 0 ? (
            <div className="drawer-empty">
              <BookOpen size={48} className="drawer-empty-icon" />
              <p className="drawer-empty-text">Bạn hiện chưa mượn cuốn sách nào.</p>
              <span className="drawer-empty-sub">Hãy khám phá danh mục và chọn sách để mượn nhé!</span>
            </div>
          ) : (
            <div className="borrowed-items-list">
              {borrowedDetails.map(({ record, book }: BorrowedDetailItem) => (
                <div key={record.bookId} className="borrowed-item-card">
                  <div className="borrowed-item-info">
                    <span className="borrowed-item-genre">{book?.genre ?? 'Chuyên ngành'}</span>
                    <h4 className="borrowed-item-title">{book?.title ?? 'Sách thư viện'}</h4>
                    <p className="borrowed-item-author">Tác giả: {book?.author}</p>
                    <div className="borrowed-dates">
                      <span title="Ngày mượn">
                        <Calendar size={13} className="inline-icon" />
                        Mượn: {new Date(record.borrowedAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="due-date" title="Hạn trả">
                        Hạn trả: {new Date(record.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-return btn-sm"
                    onClick={() => handleReturn(record.bookId)}
                    title="Trả cuốn sách này lại thư viện"
                  >
                    <RotateCcw size={15} />
                    Trả sách
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button type="button" className="btn btn-secondary w-full" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
