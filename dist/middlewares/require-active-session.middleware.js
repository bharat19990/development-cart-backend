"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveSession = void 0;
const session_query_service_1 = require("../services/session-query.service");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.requireActiveSession = (0, async_handler_util_1.asyncHandler)(async (req, _res, next) => {
    req.activeSession = await (0, session_query_service_1.getActiveSessionOrThrow)();
    next();
});
//# sourceMappingURL=require-active-session.middleware.js.map