import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Buổi 3: Typed hooks useAppDispatch & useAppSelector
 * Đảm bảo 100% type safety cho state và dispatch trong toàn bộ ứng dụng
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

