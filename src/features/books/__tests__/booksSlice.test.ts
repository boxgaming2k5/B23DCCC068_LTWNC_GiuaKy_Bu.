import booksReducer, {
  initialBooksState,
  fetchBooks,
  borrowBook,
  returnBook,
  setNotification,
  clearNotification,
  BooksState,
} from '../booksSlice';
import { Book } from '../../../types/book';

describe('booksSlice reducer tests (Buổi 6 - Redux Toolkit testing)', () => {
  const mockBook1: Book = {
    id: 'b-001',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'CNTT',
    publishedYear: 2008,
    availableCopies: 3,
    totalCopies: 5,
    description: 'A handbook of agile craftsmanship',
  };

  const mockBook2: Book = {
    id: 'b-002',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    genre: 'CNTT',
    publishedYear: 2017,
    availableCopies: 0,
    totalCopies: 4,
  };

  // Test 1: Khởi tạo state mặc định
  it('1. should return the initial state when passed an unknown action', () => {
    const result = booksReducer(undefined, { type: 'unknown_action' });
    expect(result).toEqual(initialBooksState);
  });

  // Test 2: Xử lý fetchBooks.pending
  it("2. should handle fetchBooks.pending by updating status to 'loading' and clearing error", () => {
    const prevState: BooksState = {
      ...initialBooksState,
      status: 'failed',
      error: 'Previous network failure',
    };

    const action = { type: fetchBooks.pending.type };
    const state = booksReducer(prevState, action);

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  // Test 3: Xử lý fetchBooks.fulfilled
  it("3. should handle fetchBooks.fulfilled by updating books list and setting status to 'succeeded'", () => {
    const mockBooks: Book[] = [mockBook1, mockBook2];
    const action = {
      type: fetchBooks.fulfilled.type,
      payload: mockBooks,
    };

    const state = booksReducer(initialBooksState, action);

    expect(state.status).toBe('succeeded');
    expect(state.books).toHaveLength(2);
    expect(state.books[0].title).toBe('Clean Code');
    expect(state.error).toBeNull();
  });

  // Test 4: Xử lý fetchBooks.rejected
  it("4. should handle fetchBooks.rejected by recording error message and setting status to 'failed'", () => {
    const errorMessage = 'Máy chủ thư viện không phản hồi';
    const action = {
      type: fetchBooks.rejected.type,
      payload: errorMessage,
    };

    const state = booksReducer(initialBooksState, action);

    expect(state.status).toBe('failed');
    expect(state.error).toBe(errorMessage);
  });

  // Test 5: Xử lý borrowBook action
  it('5. should handle borrowBook by decrementing availableCopies and adding to borrowedBooks', () => {
    const prevState: BooksState = {
      ...initialBooksState,
      books: [mockBook1],
      borrowedBooks: [],
    };

    const state = booksReducer(prevState, borrowBook('b-001'));

    // Số bản còn lại giảm từ 3 xuống 2
    expect(state.books[0].availableCopies).toBe(2);
    // Danh sách đang mượn có thêm 1 bản ghi
    expect(state.borrowedBooks).toHaveLength(1);
    expect(state.borrowedBooks[0].bookId).toBe('b-001');
    expect(state.notification).not.toBeNull();
    expect(state.notification?.type).toBe('success');
  });

  // Test 6: Xử lý returnBook action
  it('6. should handle returnBook by incrementing availableCopies and removing from borrowedBooks', () => {
    const prevState: BooksState = {
      ...initialBooksState,
      books: [{ ...mockBook1, availableCopies: 2 }],
      borrowedBooks: [
        {
          bookId: 'b-001',
          borrowedAt: new Date().toISOString(),
          dueDate: new Date().toISOString(),
        },
      ],
    };

    const state = booksReducer(prevState, returnBook('b-001'));

    // Số bản còn lại tăng từ 2 lên 3
    expect(state.books[0].availableCopies).toBe(3);
    // Danh sách đang mượn rỗng
    expect(state.borrowedBooks).toHaveLength(0);
    expect(state.notification?.type).toBe('info');
  });

  // Test 7: Quản lý notification
  it('7. should handle setNotification and clearNotification', () => {
    const notification = {
      id: '1',
      type: 'warning' as const,
      message: 'Cảnh báo mượn sách',
    };

    let state = booksReducer(initialBooksState, setNotification(notification));
    expect(state.notification).toEqual(notification);

    state = booksReducer(state, clearNotification());
    expect(state.notification).toBeNull();
  });
});

