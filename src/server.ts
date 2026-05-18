import { config } from './config';
import { createApp } from './app';
import { disconnectPrisma } from './services/prisma.service';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`Application is running on: http://localhost:${config.port}`);
});

async function shutdown(): Promise<void> {
  server.close();
  await disconnectPrisma();
  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown();
});

process.on('SIGTERM', () => {
  void shutdown();
});
