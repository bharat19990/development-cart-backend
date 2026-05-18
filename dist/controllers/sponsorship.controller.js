"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sponsor = void 0;
const sponsorship_service_1 = require("../services/sponsorship.service");
const errors_util_1 = require("../utils/errors.util");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.sponsor = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errors_util_1.UnauthorizedError();
    }
    if (!req.activeSession) {
        throw new errors_util_1.BadRequestError('Active session context is missing');
    }
    const result = await sponsorship_service_1.sponsorshipService.sponsor(req.user, req.activeSession, req.body);
    res.status(201).json({
        message: 'User sponsored successfully',
        ...result,
        session: req.activeSession,
    });
});
//# sourceMappingURL=sponsorship.controller.js.map