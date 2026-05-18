"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationResource = exports.getAdminResource = exports.getProfile = exports.completeProfile = void 0;
const user_service_1 = require("../services/user.service");
const errors_util_1 = require("../utils/errors.util");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.completeProfile = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errors_util_1.UnauthorizedError();
    }
    const user = await user_service_1.userService.completeProfile(req.user.id);
    res.status(200).json({
        message: 'Profile completed successfully',
        user,
        activeSession: req.activeSession,
    });
});
exports.getProfile = (0, async_handler_util_1.asyncHandler)((req, res) => {
    res.json({
        message: 'Authenticated profile',
        user: req.user,
    });
});
exports.getAdminResource = (0, async_handler_util_1.asyncHandler)((req, res) => {
    res.json({
        message: 'Admin-only resource',
        user: req.user,
    });
});
exports.getOrganizationResource = (0, async_handler_util_1.asyncHandler)((req, res) => {
    res.json({
        message: 'Organization-only resource',
        user: req.user,
    });
});
//# sourceMappingURL=users.controller.js.map