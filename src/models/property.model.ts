import mongoose, { Model, Schema } from 'mongoose';
import { PROPERTY_TYPES, PropertyDocument } from '../types/property.types';

const propertySchema = new Schema<PropertyDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: PROPERTY_TYPES,
        message: 'Invalid property type',
      },
    },
    bedrooms: {
      type: Number,
      required: [true, 'Bedrooms is required'],
      min: [0, 'Bedrooms must be a positive number'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Bathrooms is required'],
      min: [0, 'Bathrooms must be a positive number'],
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [0, 'Area must be a positive number'],
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ createdAt: -1 });
propertySchema.index({ location: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ price: 1 });

export const Property: Model<PropertyDocument> =
  mongoose.models.Property ??
  mongoose.model<PropertyDocument>('Property', propertySchema);
