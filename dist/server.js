"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const config_1 = require("./config");
const app_1 = require("./app");
const prisma_service_1 = require("./services/prisma.service");
const session_expiry_service_1 = require("./services/session-expiry.service");
const app = (0, app_1.createApp)();
void session_expiry_service_1.sessionExpiryService.expireSessions();
const expiryTimer = session_expiry_service_1.sessionExpiryService.startInterval(60_000);
const server = app.listen(config_1.config.port, () => {
    console.log(`Application is running on: http://localhost:${config_1.config.port}`);
});
async function shutdown() {
    clearInterval(expiryTimer);
    server.close();
    await (0, prisma_service_1.disconnectPrisma)();
    process.exit(0);
}
process.on('SIGINT', () => {
    void shutdown();
});
process.on('SIGTERM', () => {
    void shutdown();
});
//# sourceMappingURL=server.js.map