import { Property } from '../models/property.model';
import {
  CreatePropertyInput,
  PropertyDocument,
  UpdatePropertyInput,
} from '../types/property.types';
import {
  PropertyListOptions,
  PropertyListResult,
} from '../types/pagination.types';
import { AppError } from '../utils/AppError';
import {
  getPropertyCacheKey,
  invalidatePropertyCaches,
  PROPERTY_LIST_CACHE_KEY,
  propertyCache,
} from '../utils/propertyCache';
import { pickUpdateFields } from '../utils/pickUpdateFields';
import { validateObjectId } from '../utils/validateObjectId';

const LIST_PROJECTION = { __v: 0 } as const;

const findPropertyByIdOrThrow = async (id: string): Promise<PropertyDocument> => {
  validateObjectId(id, 'property ID');

  const cacheKey = getPropertyCacheKey(id);
  const cached = propertyCache.get<PropertyDocument>(cacheKey);

  if (cached) {
    return cached;
  }

  const property = await Property.findById(id)
    .select(LIST_PROJECTION)
    .lean<PropertyDocument>();

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  propertyCache.set(cacheKey, property);

  return property;
};

export const createProperty = async (
  input: CreatePropertyInput
): Promise<PropertyDocument> => {
  const property = await Property.create(input);
  const created = property.toObject() as PropertyDocument;

  invalidatePropertyCaches();

  return created;
};

export const getAllProperties = async (
  options?: PropertyListOptions
): Promise<PropertyListResult> => {
  if (!options) {
    const cached = propertyCache.get<PropertyDocument[]>(PROPERTY_LIST_CACHE_KEY);

    if (cached) {
      return { properties: cached };
    }

    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .select(LIST_PROJECTION)
      .lean<PropertyDocument[]>();

    propertyCache.set(PROPERTY_LIST_CACHE_KEY, properties);

    return { properties };
  }

  const cacheKey = `properties:list:page:${options.page}:${options.limit}`;
  const cached = propertyCache.get<PropertyListResult>(cacheKey);

  if (cached) {
    return cached;
  }

  const skip = (options.page - 1) * options.limit;

  const [properties, total] = await Promise.all([
    Property.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(options.limit)
      .select(LIST_PROJECTION)
      .lean<PropertyDocument[]>(),
    Property.countDocuments(),
  ]);

  const result: PropertyListResult = {
    properties,
    meta: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit),
    },
  };

  propertyCache.set(cacheKey, result);

  return result;
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
  })
    .select(LIST_PROJECTION)
    .lean<PropertyDocument>();

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  invalidatePropertyCaches(id);

  return property;
};

export const deleteProperty = async (id: string): Promise<PropertyDocument> => {
  validateObjectId(id, 'property ID');

  const property = await Property.findByIdAndDelete(id)
    .select(LIST_PROJECTION)
    .lean<PropertyDocument>();

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  invalidatePropertyCaches(id);

  return property;
};
