"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUser = void 0;
const prisma_service_1 = require("../services/prisma.service");
const jwt_util_1 = require("../utils/jwt.util");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.extractUser = (0, async_handler_util_1.asyncHandler)(async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        next();
        return;
    }
    const token = authHeader.slice(7);
    try {
        const payload = (0, jwt_util_1.verifyToken)(token);
        const user = await prisma_service_1.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (user) {
            req.user = user;
        }
    }
    catch {
    }
    next();
});
//# sourceMappingURL=extract-user.middleware.js.map