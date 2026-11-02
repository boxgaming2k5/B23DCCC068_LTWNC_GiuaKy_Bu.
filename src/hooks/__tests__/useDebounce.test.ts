import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce custom hook generic tests (Buổi 6 - Fake Timers testing)', () => {
  beforeEach(() => {
    // Kích hoạt Jest Fake Timers để kiểm soát thời gian setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Dọn dẹp và khôi phục real timers
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Test 1: Đảm bảo useDebounce chỉ cập nhật giá trị sau đúng khoảng thời gian delay quy định
  it('1. should debounce value updates using fake timers (300ms default)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay?: number }) =>
        useDebounce<string>(value, delay),
      {
        initialProps: { value: 'React' },
      }
    );

    // Giá trị ban đầu trả về ngay lập tức
    expect(result.current).toBe('React');

    // Thay đổi giá trị thành 'React TypeScript'
    rerender({ value: 'React TypeScript' });

    // Ngay sau khi re-render (0ms), giá trị debounced vẫn chưa thay đổi
    expect(result.current).toBe('React');

    // Thời gian trôi qua 150ms (chưa đủ 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('React');

    // Thời gian trôi thêm 149ms (tổng 299ms, vẫn thiếu 1ms)
    act(() => {
      jest.advanceTimersByTime(149);
    });
    expect(result.current).toBe('React');

    // Thời gian trôi thêm 1ms (đạt mốc 300ms)
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Lúc này giá trị debounced đã được cập nhật chính xác!
    expect(result.current).toBe('React TypeScript');
  });

  // Test 2: Hủy timer nếu giá trị thay đổi liên tục trước khi hết thời gian chờ
  it('2. should cancel previous timer when value changes rapidly before delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce<string>(value, 300),
      {
        initialProps: { value: 'A' },
      }
    );

    expect(result.current).toBe('A');

    // User gõ nhanh liên tiếp
    rerender({ value: 'AB' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'ABC' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'ABCD' });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Tại thời điểm này (tổng 300ms nhưng cách nhau 100ms), timer trước đó đều bị reset
    expect(result.current).toBe('A');

    // Chờ trọn vẹn 300ms kể từ lần gõ cuối cùng
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Chỉ cập nhật giá trị cuối cùng 'ABCD'
    expect(result.current).toBe('ABCD');
  });

  // Test 3: Generic type safety hoạt động hoàn hảo với kiểu Number và Object
  it('3. should support generic types such as number and complex objects', () => {
    const initialObject = { count: 0, query: 'init' };
    const updatedObject = { count: 10, query: 'done' };

    const { result, rerender } = renderHook(
      ({ obj }) => useDebounce<typeof initialObject>(obj, 400),
      {
        initialProps: { obj: initialObject },
      }
    );

    expect(result.current).toEqual(initialObject);

    rerender({ obj: updatedObject });
    expect(result.current).toEqual(initialObject);

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(result.current).toEqual(updatedObject);
  });
});

