import { UpdatePropertyInput } from '../types/property.types';

const UPDATABLE_FIELDS = [
  'title',
  'description',
  'price',
  'location',
  'propertyType',
  'bedrooms',
  'bathrooms',
  'area',
] as const satisfies ReadonlyArray<keyof UpdatePropertyInput>;

export const pickUpdateFields = (input: UpdatePropertyInput): UpdatePropertyInput => {
  return UPDATABLE_FIELDS.reduce<UpdatePropertyInput>((acc, field) => {
    const value = input[field];

    if (value !== undefined) {
      return { ...acc, [field]: value };
    }

    return acc;
  }, {});
};
