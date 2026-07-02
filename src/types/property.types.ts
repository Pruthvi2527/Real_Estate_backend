import { Document, Types } from 'mongoose';

export const PROPERTY_TYPES = [
  'apartment',
  'house',
  'villa',
  'condo',
  'land',
  'commercial',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export interface Property {
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

export interface PropertyDocument extends Property, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePropertyInput = Property;

export type UpdatePropertyInput = Partial<Property>;
