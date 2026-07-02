import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler<
  P = Request['params'],
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Request['query'],
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = <
  P = Request['params'],
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Request['query'],
>(
  handler: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>
): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(
      handler(req as Request<P, ResBody, ReqBody, ReqQuery>, res, next)
    ).catch(next);
  };
