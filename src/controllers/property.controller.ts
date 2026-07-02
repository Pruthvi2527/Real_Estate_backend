import { Request, Response } from 'express';
import * as propertyService from '../services/property.service';
import { CreatePropertyInput, UpdatePropertyInput } from '../types/property.types';
import { asyncHandler } from '../utils/asyncHandler';
import { parseRouteParam } from '../utils/parseRouteParam';
import { sendCreated, sendOk } from '../utils/response';

type PropertyIdParams = { id: string };

export const createProperty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const property = await propertyService.createProperty(
      req.body as CreatePropertyInput
    );

    sendCreated(res, 'Property created successfully', property);
  }
);

export const getAllProperties = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const properties = await propertyService.getAllProperties();

    sendOk(res, 'Properties fetched successfully', properties);
  }
);

export const getPropertyById = asyncHandler(
  async (req: Request<PropertyIdParams>, res: Response): Promise<void> => {
    const property = await propertyService.getPropertyById(
      parseRouteParam(req.params.id)
    );

    sendOk(res, 'Property fetched successfully', property);
  }
);

export const updateProperty = asyncHandler(
  async (req: Request<PropertyIdParams>, res: Response): Promise<void> => {
    const property = await propertyService.updateProperty(
      parseRouteParam(req.params.id),
      req.body as UpdatePropertyInput
    );

    sendOk(res, 'Property updated successfully', property);
  }
);

export const deleteProperty = asyncHandler(
  async (req: Request<PropertyIdParams>, res: Response): Promise<void> => {
    const property = await propertyService.deleteProperty(
      parseRouteParam(req.params.id)
    );

    sendOk(res, 'Property deleted successfully', property);
  }
);
