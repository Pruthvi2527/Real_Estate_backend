import { AppError } from './AppError';

export const parseRouteParam = (param: string | string[]): string => {
  const value = Array.isArray(param) ? param[0] : param;

  if (!value) {
    throw new AppError('Invalid route parameter', 400);
  }

  return value;
};
