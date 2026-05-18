"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const config_1 = require("./config");
const app_1 = require("./app");
const prisma_service_1 = require("./services/prisma.service");
const app = (0, app_1.createApp)();
const server = app.listen(config_1.config.port, () => {
    console.log(`Application is running on: http://localhost:${config_1.config.port}`);
});
async function shutdown() {
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