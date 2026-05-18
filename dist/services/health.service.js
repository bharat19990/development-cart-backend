"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthService = exports.HealthService = void 0;
class HealthService {
    getStatus() {
        return {
            status: 'ok',
            message: 'Development Cart API is running',
            timestamp: new Date().toISOString(),
        };
    }
}
exports.HealthService = HealthService;
exports.healthService = new HealthService();
//# sourceMappingURL=health.service.js.map