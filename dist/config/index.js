"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("reflect-metadata");
require("dotenv/config");
const configuration_1 = __importDefault(require("./configuration"));
const env_validation_1 = require("./env.validation");
(0, env_validation_1.validateEnv)(process.env);
const appConfig = (0, configuration_1.default)();
exports.config = {
    nodeEnv: appConfig.nodeEnv,
    port: appConfig.port,
    database: appConfig.database,
    jwt: appConfig.jwt,
    enrollmentFeeUsd: appConfig.enrollmentFeeUsd,
    sessionDurationDays: appConfig.sessionDurationDays,
    superadminEmail: appConfig.superadminEmail,
    superadminPassword: appConfig.superadminPassword,
};
//# sourceMappingURL=index.js.map