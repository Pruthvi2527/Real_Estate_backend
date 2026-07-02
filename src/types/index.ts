import type { PaginationMeta } from './pagination.types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string | null;
  meta?: PaginationMeta;
}

export type { PaginationMeta, PropertyListOptions, PropertyListResult } from './pagination.types';

export interface ParsedError {
  statusCode: number;
  message: string;
  error: string;
}

export type {
  CreatePropertyInput,
  Property,
  PropertyDocument,
  PropertyType,
  UpdatePropertyInput,
} from './property.types';

export { PROPERTY_TYPES } from './property.types';
