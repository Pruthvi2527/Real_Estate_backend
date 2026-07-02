import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { parseKnownError } from '../utils/errorFormatters';
import { sendError, sendParsedError } from '../utils/response';

const toError = (err: unknown): Error =>
  err instanceof Error ? err : new Error(String(err));

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (res.headersSent) {
    console.error('Error after headers sent:', err);
    return;
  }

  const error = toError(err);

  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message, error.message);
    return;
  }

  const parsed = parseKnownError(error);

  if (parsed) {
    sendParsedError(res, parsed);
    return;
  }

  console.error('Unhandled error:', error);

  const message =
    env.NODE_ENV === 'development' ? error.message : 'Internal server error';
  const errorDetail =
    env.NODE_ENV === 'development' && error.stack ? error.stack : message;

  sendError(res, 500, message, errorDetail);
};
