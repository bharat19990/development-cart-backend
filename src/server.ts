import 'reflect-metadata';
import { config } from './config';
import { createApp } from './app';
import { disconnectPrisma } from './services/prisma.service';
import { sessionExpiryService } from './services/session-expiry.service';

const app = createApp();

void sessionExpiryService.expireSessions();
const expiryTimer = sessionExpiryService.startInterval(60_000);

const server = app.listen(config.port, () => {
  console.log(`Application is running on: http://localhost:${config.port}`);
});

async function shutdown(): Promise<void> {
  clearInterval(expiryTimer);
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
