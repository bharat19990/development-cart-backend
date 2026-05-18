"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveSession = void 0;
const client_1 = require("@prisma/client");
const errors_util_1 = require("../utils/errors.util");
const prisma_service_1 = require("../services/prisma.service");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.requireActiveSession = (0, async_handler_util_1.asyncHandler)(async (req, _res, next) => {
    const activeSession = await prisma_service_1.prisma.session.findFirst({
        where: { status: client_1.SessionStatus.ACTIVE },
        select: {
            id: true,
            title: true,
            status: true,
            startsAt: true,
            endsAt: true,
        },
        orderBy: { updatedAt: 'desc' },
    });
    if (!activeSession) {
        throw new errors_util_1.NotFoundError('No active session found');
    }
    req.activeSession = activeSession;
    next();
});
//# sourceMappingURL=require-active-session.middleware.js.map