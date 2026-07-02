import { PropertyDocument } from './property.types';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PropertyListOptions {
  page: number;
  limit: number;
}

export interface PropertyListResult {
  properties: PropertyDocument[];
  meta?: PaginationMeta;
}

const MAX_PAGE_LIMIT = 100;

export const parsePropertyListQuery = (
  pageValue: unknown,
  limitValue: unknown
): PropertyListOptions | null => {
  if (pageValue === undefined || limitValue === undefined) {
    return null;
  }

  const page = Number(pageValue);
  const limit = Number(limitValue);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    return null;
  }

  return {
    page,
    limit: Math.min(limit, MAX_PAGE_LIMIT),
  };
};
