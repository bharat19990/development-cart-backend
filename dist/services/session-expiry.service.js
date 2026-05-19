"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionExpiryService = exports.SessionExpiryService = void 0;
const client_1 = require("@prisma/client");
const prisma_service_1 = require("./prisma.service");
class SessionExpiryService {
    async expireSessions() {
        const now = new Date();
        const result = await prisma_service_1.prisma.session.updateMany({
            where: {
                status: client_1.SessionStatus.ACTIVE,
                endsAt: { lt: now },
            },
            data: { status: client_1.SessionStatus.COMPLETED },
        });
        return result.count;
    }
    startInterval(ms = 60_000) {
        return setInterval(() => {
            void this.expireSessions();
        }, ms);
    }
}
exports.SessionExpiryService = SessionExpiryService;
exports.sessionExpiryService = new SessionExpiryService();
//# sourceMappingURL=session-expiry.service.js.map