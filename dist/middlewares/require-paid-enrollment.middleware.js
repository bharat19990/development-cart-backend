"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePaidEnrollment = void 0;
const client_1 = require("@prisma/client");
const errors_util_1 = require("../utils/errors.util");
const prisma_service_1 = require("../services/prisma.service");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.requirePaidEnrollment = (0, async_handler_util_1.asyncHandler)(async (req, _res, next) => {
    if (!req.user || !req.activeSession) {
        next(new errors_util_1.ForbiddenError('Access denied'));
        return;
    }
    const enrollment = await prisma_service_1.prisma.enrollment.findUnique({
        where: {
            userId_sessionId: {
                userId: req.user.id,
                sessionId: req.activeSession.id,
            },
        },
        select: { paymentStatus: true },
    });
    if (!enrollment || enrollment.paymentStatus !== client_1.PaymentStatus.PAID) {
        next(new errors_util_1.ForbiddenError('Paid enrollment in the active session is required to access this feature'));
        return;
    }
    next();
});
//# sourceMappingURL=require-paid-enrollment.middleware.js.map