import { useState, useEffect } from 'react';

/**
 * Buổi 2 & Buổi 5: Custom hook generic useDebounce<T>
 * Trì hoãn việc cập nhật giá trị cho đến khi hết khoảng thời gian delay (chống spam re-render)
 * 
 * @template T Kiểu dữ liệu của giá trị đầu vào
 * @param value Giá trị cần debounce (kiểu generic T)
 * @param delay Thời gian trễ (mili-giây, mặc định 300ms theo yêu cầu đề bài)
 * @returns Giá trị sau khi đã debounce
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

