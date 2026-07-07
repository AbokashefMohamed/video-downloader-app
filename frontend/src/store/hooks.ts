import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';


// use these instead of usedispatch or useselector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);