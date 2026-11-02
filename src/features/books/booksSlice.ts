import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, BorrowRecord, AppNotification, isApiSuccess, isApiError } from '../../types/book';
import { fetchBooksApi } from '../../api/booksApi';

export interface BooksState {
  books: Book[];
  borrowedBooks: BorrowRecord[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  notification: AppNotification | null;
}

export const initialBooksState: BooksState = {
  books: [],
  borrowedBooks: [],
  status: 'idle',
  error: null,
  notification: null,
};

/**
 * Buổi 3: createAsyncThunk xử lý đầy đủ 3 trạng thái (pending, fulfilled, rejected)
 * Sử dụng API giả lập và type guard kiểm tra kết quả trả về
 */
export const fetchBooks = createAsyncThunk<
  Book[],
  boolean | undefined,
  { rejectValue: string }
>(
  'books/fetchBooks',
  async (shouldFail = false, { rejectWithValue }) => {
    try {
      const response = await fetchBooksApi(shouldFail);
      
      // Vận dụng Type Guard đã định nghĩa ở Buổi 1
      if (isApiSuccess(response)) {
        return response.data;
      }
      
      if (isApiError(response)) {
        return rejectWithValue(response.error);
      }

      return rejectWithValue('Dữ liệu trả về không hợp lệ từ hệ thống thư viện.');
    } catch (err) {
      return rejectWithValue('Lỗi không mong muốn trong quá trình kết nối API.');
    }
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState: initialBooksState,
  reducers: {
    // Chức năng 5: Mượn sách - Giảm số bản còn lại đi 1 và lưu vào danh sách đang mượn
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.books.find((b) => b.id === bookId);

      if (book && book.availableCopies > 0) {
        book.availableCopies -= 1;

        const now = new Date();
        const dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // Hạn trả 14 ngày

        state.borrowedBooks.push({
          bookId,
          borrowedAt: now.toISOString(),
          dueDate: dueDate.toISOString(),
        });

        state.notification = {
          id: Date.now().toString(),
          type: 'success',
          message: `Mượn sách "${book.title}" thành công! Hạn trả: 14 ngày.`,
          duration: 4000,
        };
      }
    },

    // Chức năng 6: Trả sách - Tăng số bản còn lại lên 1 và gỡ khỏi danh sách đang mượn
    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.books.find((b) => b.id === bookId);
      const borrowIndex = state.borrowedBooks.findIndex((r) => r.bookId === bookId);

      if (borrowIndex !== -1) {
        state.borrowedBooks.splice(borrowIndex, 1);
        if (book) {
          book.availableCopies += 1;
        }

        state.notification = {
          id: Date.now().toString(),
          type: 'info',
          message: book
            ? `Đã trả cuốn sách "${book.title}". Cảm ơn bạn!`
            : 'Đã hoàn tất trả sách.',
          duration: 3500,
        };
      }
    },

    // Quản lý thông báo toast / banner cảnh báo
    setNotification: (state, action: PayloadAction<AppNotification | null>) => {
      state.notification = action.payload;
    },

    clearNotification: (state) => {
      state.notification = null;
    },
  },

  // Buổi 3: Xử lý đủ 3 trạng thái của createAsyncThunk
  extraReducers: (builder) => {
    builder
      // 1. Pending
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // 2. Fulfilled
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.books = action.payload;
        state.error = null;
      })
      // 3. Rejected
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Đã xảy ra lỗi không xác định khi tải sách.';
      });
  },
});

export const { borrowBook, returnBook, setNotification, clearNotification } = booksSlice.actions;

export default booksSlice.reducer;

