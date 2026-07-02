import { env } from './config/env';
import app from './app';
import { connectDB, disconnectDB } from './config/db';

const SHUTDOWN_TIMEOUT_MS = 10_000;

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const shutdown = (signal: string): void => {
    console.log(`${signal} received. Shutting down gracefully...`);

    const forceExitTimer = setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    server.close(async () => {
      clearTimeout(forceExitTimer);
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
