import { useMemo } from 'react';
import { useAppSelector } from '../app/hooks';
import { useFilterStore } from '../store/useFilterStore';
import { useDebounce } from './useDebounce';
import { Book } from '../types/book';

/**
 * Buổi 5: Tối ưu hiệu năng - Danh sách sách sau khi lọc được tính toán bằng useMemo
 * Kết hợp debounce 300ms từ Zustand search query và selectedGenre
 */
export function useBooksFilter() {
  const books = useAppSelector((state) => state.books.books);
  const { searchQuery, selectedGenre } = useFilterStore();

  // Áp dụng custom hook generic useDebounce 300ms
  const debouncedQuery = useDebounce<string>(searchQuery, 300);

  // Tính toán danh sách sách đã lọc bằng useMemo để tránh tính toán lại không cần thiết
  const filteredBooks = useMemo<Book[]>(() => {
    const query = debouncedQuery.trim().toLowerCase();

    return books.filter((book: Book) => {
      // 1. Lọc theo thể loại
      const matchesGenre =
        selectedGenre === 'All' || book.genre === selectedGenre;

      if (!matchesGenre) return false;

      // 2. Lọc theo từ khóa: Tên sách hoặc Tác giả (không phân biệt hoa thường)
      if (!query) return true;

      const titleMatch = book.title.toLowerCase().includes(query);
      const authorMatch = book.author.toLowerCase().includes(query);

      return titleMatch || authorMatch;
    });
  }, [books, debouncedQuery, selectedGenre]);

  const isFiltering = debouncedQuery.trim().length > 0 || selectedGenre !== 'All';

  return {
    filteredBooks,
    debouncedQuery,
    searchQuery,
    selectedGenre,
    isFiltering,
    totalBooks: books.length,
    filteredCount: filteredBooks.length,
  };
}

