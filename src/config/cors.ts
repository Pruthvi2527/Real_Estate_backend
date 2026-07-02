import type { CorsOptions } from 'cors';
import { env } from './env';

const getAllowedOrigins = (): string[] => {
  const configured = Array.isArray(env.CORS_ORIGIN)
    ? env.CORS_ORIGIN
    : [env.CORS_ORIGIN];

  return configured;
};

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) {
    return true;
  }

  if (getAllowedOrigins().includes(origin)) {
    return true;
  }

  // Vercel production and preview deployments.
  if (origin.endsWith('.vercel.app')) {
    return true;
  }

  return false;
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }

    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
};
