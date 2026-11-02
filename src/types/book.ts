/**
 * Buổi 1 — TypeScript nâng cao:
 * - Generic API response ({ ok: true, data: T } | { ok: false, error: string })
 * - Type Guard kiểm tra phân biệt 2 trường hợp
 * - Sử dụng tối thiểu 2 Utility Types (Pick, Omit, Record, Readonly, Partial)
 * - Nghiêm ngặt: KHÔNG dùng `any`
 */

export type BookGenre = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export type FilterGenre = 'All' | BookGenre;

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: BookGenre;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  description?: string;
  isbn?: string;
  ddc?: string;
  doi?: string;
}

export interface BorrowRecord {
  bookId: string;
  borrowedAt: string; // ISO String
  dueDate: string;    // ISO String
}

// ==========================================
// Generic API Response Pattern
// ==========================================
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  message?: string;
}

export interface ApiError {
  ok: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ==========================================
// Type Guards
// ==========================================
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.ok === true && 'data' in response;
}

export function isApiError<T>(response: ApiResponse<T>): response is ApiError {
  return response.ok === false && typeof response.error === 'string';
}

// ==========================================
// Advanced Utility Types Demonstration
// ==========================================
// Utility Type 1: Pick - Tóm tắt thông tin sách hiển thị dạng danh sách gọn
export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'genre' | 'availableCopies'>;

// Utility Type 2: Omit - Kiểu dữ liệu để thêm sách mới không cần id sinh tự động
export type CreateBookPayload = Omit<Book, 'id'>;

// Utility Type 3: Record - Map thể loại sách sang số lượng thống kê
export type GenreCountRecord = Record<BookGenre, number>;

// Utility Type 4: Readonly - Đảm bảo tính bất biến của dữ liệu sách sau khi render
export type ReadonlyBook = Readonly<Book>;

// Utility Type 5: Partial - Dùng cho cập nhật thông tin sách
export type UpdateBookPayload = Partial<Omit<Book, 'id'>>;

// ==========================================
// Notification / Toast Types
// ==========================================
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

