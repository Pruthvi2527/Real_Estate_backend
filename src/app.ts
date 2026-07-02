import express, { Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { corsOptions } from './config/cors';
import { errorHandler, notFoundHandler } from './middleware';
import routes from './routes';
import propertyRoutes from './routes/property.routes';

const app: Application = express();

const propertyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(compression({ threshold: 1024 }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '100kb' }));

app.use('/api', routes);
app.use('/properties', propertyRateLimiter, propertyRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
