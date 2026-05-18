"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveSession = exports.createSession = void 0;
const session_service_1 = require("../services/session.service");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.createSession = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    const session = await session_service_1.sessionService.create(req.body);
    res.status(201).json(session);
});
exports.getActiveSession = (0, async_handler_util_1.asyncHandler)(async (_req, res) => {
    const session = await session_service_1.sessionService.getActive();
    res.json(session);
});
//# sourceMappingURL=session.controller.js.map