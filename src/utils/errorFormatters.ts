import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import { ParsedError } from '../types';

export const isCastError = (
  error: Error
): error is mongoose.Error.CastError =>
  error instanceof mongoose.Error.CastError;

export const isMongooseValidationError = (
  error: Error
): error is mongoose.Error.ValidationError =>
  error instanceof mongoose.Error.ValidationError;

export const isDuplicateKeyError = (error: Error): error is MongoServerError =>
  error instanceof MongoServerError && error.code === 11000;

const formatCastError = (error: mongoose.Error.CastError): ParsedError => ({
  statusCode: 400,
  message: 'Invalid resource ID',
  error: `Invalid ${error.path}: ${String(error.value)}`,
});

const formatValidationError = (
  error: mongoose.Error.ValidationError
): ParsedError => ({
  statusCode: 400,
  message: 'Validation failed',
  error: Object.values(error.errors)
    .map((err) => err.message)
    .join(', '),
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
