import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const THEME_STORAGE_KEY = 'mini_library_theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

/**
 * Buổi 4: Context nâng cao quản lý Theme Sáng / Tối
 * - Có useMemo cho Context value
 * - Đồng bộ với thuộc tính data-theme và class 'dark' trên root HTML
 * - Tự động ghi nhớ lựa chọn vào localStorage
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (defaultTheme) return defaultTheme;
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      // Kiểm tra hệ thống người dùng thích chế độ tối
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Tối ưu hiệu năng: useMemo cho context value để tránh re-render không cần thiết
  const contextValue = useMemo<ThemeContextValue>(() => ({
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook useTheme để các component dễ dàng truy cập theme
 * Kèm kiểm tra an toàn nếu gọi ngoài Provider
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong một ThemeProvider');
  }
  return context;
};

