import { configureStore } from '@reduxjs/toolkit';
import booksReducer, {
  borrowBook,
  BooksState,
  initialBooksState,
} from '../../../features/books/booksSlice';
import { borrowLimitMiddleware } from '../borrowLimitMiddleware';
import { Book } from '../../../types/book';

describe('borrowLimitMiddleware tests (Buổi 4 - Custom Redux Middleware testing)', () => {
  const mockBooks: Book[] = [
    {
      id: 'b-1',
      title: 'Sách 1',
      author: 'Tác giả 1',
      genre: 'CNTT',
      publishedYear: 2020,
      availableCopies: 2,
      totalCopies: 3,
    },
    {
      id: 'b-2',
      title: 'Sách 2',
      author: 'Tác giả 2',
      genre: 'Kinh tế',
      publishedYear: 2021,
      availableCopies: 2,
      totalCopies: 3,
    },
    {
      id: 'b-3',
      title: 'Sách 3',
      author: 'Tác giả 3',
      genre: 'Ngoại ngữ',
      publishedYear: 2022,
      availableCopies: 2,
      totalCopies: 3,
    },
    {
      id: 'b-4',
      title: 'Sách 4',
      author: 'Tác giả 4',
      genre: 'CNTT',
      publishedYear: 2023,
      availableCopies: 2,
      totalCopies: 3,
    },
  ];

  const createTestStore = (customPreloadedState?: Partial<BooksState>) => {
    return configureStore({
      reducer: {
        books: booksReducer,
      },
      preloadedState: {
        books: {
          ...initialBooksState,
          books: mockBooks,
          ...customPreloadedState,
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(borrowLimitMiddleware),
    });
  };

  it('1. should allow borrowing when user has borrowed fewer than 3 books', () => {
    const store = createTestStore({
      borrowedBooks: [
        { bookId: 'b-1', borrowedAt: '2026-01-01', dueDate: '2026-01-15' },
      ],
    });

    store.dispatch(borrowBook('b-2'));

    const state = store.getState().books;
    expect(state.borrowedBooks).toHaveLength(2);
    expect(state.books.find((b) => b.id === 'b-2')?.availableCopies).toBe(1);
    expect(state.notification?.type).toBe('success');
  });

  it('2. should BLOCK borrowBook action and trigger warning when user already borrowed 3 books', () => {
    const store = createTestStore({
      borrowedBooks: [
        { bookId: 'b-1', borrowedAt: '2026-01-01', dueDate: '2026-01-15' },
        { bookId: 'b-2', borrowedAt: '2026-01-01', dueDate: '2026-01-15' },
        { bookId: 'b-3', borrowedAt: '2026-01-01', dueDate: '2026-01-15' },
      ],
    });

    // Cố gắng mượn cuốn thứ 4
    store.dispatch(borrowBook('b-4'));

    const state = store.getState().books;
    // Bị chặn! Danh sách mượn vẫn là 3 cuốn
    expect(state.borrowedBooks).toHaveLength(3);
    // Cuốn b-4 không bị trừ số lượng
    expect(state.books.find((b) => b.id === 'b-4')?.availableCopies).toBe(2);
    // Xuất hiện cảnh báo
    expect(state.notification).not.toBeNull();
    expect(state.notification?.type).toBe('warning');
    expect(state.notification?.message).toContain('tối đa 3 cuốn');
  });

  it('3. should BLOCK borrowing the same book twice', () => {
    const store = createTestStore({
      borrowedBooks: [
        { bookId: 'b-1', borrowedAt: '2026-01-01', dueDate: '2026-01-15' },
      ],
    });

    // Cố tình mượn lại cuốn b-1
    store.dispatch(borrowBook('b-1'));

    const state = store.getState().books;
    expect(state.borrowedBooks).toHaveLength(1);
    expect(state.notification?.type).toBe('warning');
    expect(state.notification?.message).toContain('đang mượn cuốn sách');
    expect(state.notification?.message).toContain('Mỗi người chỉ được mượn 1 cuốn');
  });
});

