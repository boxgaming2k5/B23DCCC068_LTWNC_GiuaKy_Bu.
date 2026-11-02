import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { borrowBook, setNotification } from '../../features/books/booksSlice';
import { Book, BorrowRecord } from '../../types/book';

export const MAX_BORROW_LIMIT = 3;

/**
 * Buổi 4: Middleware Redux tự viết kiểm soát nghiệp vụ mượn sách
 * Đáp ứng Yêu cầu kỹ thuật 3 & Yêu cầu chức năng 7:
 * - Chặn action mượn sách nếu sinh viên đã mượn tối đa 3 cuốn cùng lúc
 * - Chặn nếu sinh viên đang mượn cuốn sách này
 * - Tự động dispatch thông báo cảnh báo mà không thay đổi state trong reducer
 */
export const borrowLimitMiddleware: Middleware<{}, RootState> = (storeApi) => (next) => (action) => {
  // Kiểm tra nếu action dispatch là action borrowBook
  if (borrowBook.match(action)) {
    const bookId = action.payload;
    const state = storeApi.getState();
    const { books, borrowedBooks } = state.books;

    // 1. Kiểm tra giới hạn tối đa 3 cuốn
    if (borrowedBooks.length >= MAX_BORROW_LIMIT) {
      storeApi.dispatch(
        setNotification({
          id: `warn-limit-${Date.now()}`,
          type: 'warning',
          message: `Cảnh báo: Mỗi sinh viên chỉ được mượn tối đa ${MAX_BORROW_LIMIT} cuốn cùng lúc! Bạn đang giữ ${borrowedBooks.length} cuốn, vui lòng trả bớt sách trước khi mượn tiếp.`,
          duration: 6000,
        })
      );
      // Chặn action không cho đi tiếp vào reducer
      return;
    }

    // 2. Kiểm tra nếu sinh viên đã mượn cuốn sách này rồi
    const alreadyBorrowed = borrowedBooks.some((b: BorrowRecord) => b.bookId === bookId);
    if (alreadyBorrowed) {
      const targetBook = books.find((b: Book) => b.id === bookId);
      storeApi.dispatch(
        setNotification({
          id: `warn-duplicate-${Date.now()}`,
          type: 'warning',
          message: `Bạn đang mượn cuốn sách "${targetBook ? targetBook.title : 'này'}" rồi. Mỗi người chỉ được mượn 1 cuốn cho cùng một đầu sách!`,
          duration: 5000,
        })
      );
      // Chặn action
      return;
    }
  }

  // Cho phép action tiếp tục nếu thoả mãn mọi điều kiện
  return next(action);
};
