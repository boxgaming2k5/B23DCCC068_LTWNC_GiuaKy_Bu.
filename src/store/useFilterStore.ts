import { create } from 'zustand';
import { FilterGenre } from '../types/book';

interface FilterState {
  searchQuery: string;
  selectedGenre: FilterGenre;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: FilterGenre) => void;
  resetFilters: () => void;
}

/**
 * Buổi 4: Quản lý State bộ lọc (từ khoá, thể loại) bằng Zustand
 * Giữ state tách biệt khỏi Redux theo đúng yêu cầu đề bài
 */
export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedGenre: 'All',

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSelectedGenre: (genre: FilterGenre) => set({ selectedGenre: genre }),

  resetFilters: () => set({ searchQuery: '', selectedGenre: 'All' }),
}));

