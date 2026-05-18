"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = exports.getRoot = void 0;
const health_service_1 = require("../services/health.service");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.getRoot = (0, async_handler_util_1.asyncHandler)((_req, res) => {
    res.json(health_service_1.healthService.getStatus());
});
exports.getHealth = (0, async_handler_util_1.asyncHandler)((_req, res) => {
    res.json(health_service_1.healthService.getStatus());
});
//# sourceMappingURL=health.controller.js.map