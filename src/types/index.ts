export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string | null;
}

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
