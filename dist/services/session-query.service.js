"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveSessionOrThrow = getActiveSessionOrThrow;
exports.isSessionExpired = isSessionExpired;
const client_1 = require("@prisma/client");
const errors_util_1 = require("../utils/errors.util");
const session_expiry_service_1 = require("./session-expiry.service");
const prisma_service_1 = require("./prisma.service");
const activeSessionSelect = {
    id: true,
    title: true,
    status: true,
    adminId: true,
    startsAt: true,
    endsAt: true,
};
async function getActiveSessionOrThrow() {
    await session_expiry_service_1.sessionExpiryService.expireSessions();
    const session = await prisma_service_1.prisma.session.findFirst({
        where: {
            status: client_1.SessionStatus.ACTIVE,
            endsAt: { gte: new Date() },
        },
        select: activeSessionSelect,
        orderBy: { updatedAt: 'desc' },
    });
    if (!session) {
        throw new errors_util_1.NotFoundError('No active admin session found. Enrollment and learning features are unavailable.');
    }
    return session;
}
function isSessionExpired(session) {
    return (session.status === client_1.SessionStatus.COMPLETED ||
        session.status === client_1.SessionStatus.CANCELLED ||
        session.endsAt < new Date());
}
//# sourceMappingURL=session-query.service.js.map