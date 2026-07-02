import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import { ParsedError } from '../types';

export const isCastError = (
  error: unknown
): error is mongoose.Error.CastError =>
  error instanceof mongoose.Error.CastError;

export const isMongooseValidationError = (
  error: unknown
): error is mongoose.Error.ValidationError =>
  error instanceof mongoose.Error.ValidationError;

export const isDuplicateKeyError = (
  error: unknown
): error is MongoServerError =>
  error instanceof MongoServerError && error.code === 11000;

const formatCastError = (error: mongoose.Error.CastError): ParsedError => ({
  statusCode: 400,
  message: 'Invalid resource ID',
  error: `Invalid ${error.path}: ${String(error.value)}`,
});

const getValidatorMessage = (
  err: mongoose.Error.ValidatorError | mongoose.Error.CastError
): string => {
  if ('message' in err && typeof err.message === 'string') {
    return err.message;
  }

  return 'Validation error';
};

const formatValidationError = (
  error: mongoose.Error.ValidationError
): ParsedError => ({
  statusCode: 400,
  message: 'Validation failed',
  error: Object.values(error.errors).map(getValidatorMessage).join(', '),
});

const formatDuplicateKeyError = (error: MongoServerError): ParsedError => {
  const field = Object.keys(error.keyPattern ?? {})[0] ?? 'field';

  return {
    statusCode: 409,
    message: 'Duplicate field value',
    error: `${field} already exists`,
  };
};

export const parseKnownError = (error: Error): ParsedError | null => {
  if (isCastError(error)) {
    return formatCastError(error);
  }

  if (isMongooseValidationError(error)) {
    return formatValidationError(error);
  }

  if (isDuplicateKeyError(error)) {
    return formatDuplicateKeyError(error);
  }

  return null;
};
