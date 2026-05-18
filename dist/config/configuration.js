"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? 'change-me-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    },
});
//# sourceMappingURL=configuration.js.map