import { Response } from 'express';
import { ApiResponse, ParsedError } from '../types';

const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data: data ?? null,
  };

  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: string
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    error: error ?? message,
  };

  res.status(statusCode).json(response);
};

export const sendParsedError = (res: Response, parsed: ParsedError): void => {
  sendError(res, parsed.statusCode, parsed.message, parsed.error);
};

export const sendCreated = <T>(res: Response, message: string, data: T): void => {
  sendSuccess(res, 201, message, data);
};

export const sendOk = <T>(res: Response, message: string, data?: T): void => {
  sendSuccess(res, 200, message, data);
};
