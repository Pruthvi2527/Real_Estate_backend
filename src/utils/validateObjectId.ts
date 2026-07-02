import mongoose from 'mongoose';
import { AppError } from './AppError';

const isValidObjectId = (id: string): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  return String(new mongoose.Types.ObjectId(id)) === id;
};

export const validateObjectId = (id: string, label = 'ID'): void => {
  if (!isValidObjectId(id)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};
