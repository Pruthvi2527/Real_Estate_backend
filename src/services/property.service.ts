import { Property } from '../models/property.model';
import {
  CreatePropertyInput,
  PropertyDocument,
  UpdatePropertyInput,
} from '../types/property.types';
import { AppError } from '../utils/AppError';
import { pickUpdateFields } from '../utils/pickUpdateFields';
import { validateObjectId } from '../utils/validateObjectId';

const findPropertyByIdOrThrow = async (id: string): Promise<PropertyDocument> => {
  validateObjectId(id, 'property ID');

  const property = await Property.findById(id).lean<PropertyDocument>();

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  return property;
};

export const createProperty = async (
  input: CreatePropertyInput
): Promise<PropertyDocument> => {
  const property = await Property.create(input);
  return property.toObject() as PropertyDocument;
};

export const getAllProperties = async (): Promise<PropertyDocument[]> => {
  return Property.find().sort({ createdAt: -1 }).lean<PropertyDocument[]>();
};

export const getPropertyById = async (id: string): Promise<PropertyDocument> => {
  return findPropertyByIdOrThrow(id);
};

export const updateProperty = async (
  id: string,
  input: UpdatePropertyInput
): Promise<PropertyDocument> => {
  validateObjectId(id, 'property ID');

  const property = await Property.findByIdAndUpdate(id, pickUpdateFields(input), {
    new: true,
    runValidators: true,
  }).lean<PropertyDocument>();

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  return property;
};

export const deleteProperty = async (id: string): Promise<PropertyDocument> => {
  validateObjectId(id, 'property ID');

  const property = await Property.findByIdAndDelete(id).lean<PropertyDocument>();

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  return property;
};
