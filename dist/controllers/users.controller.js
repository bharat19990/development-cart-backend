"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationResource = exports.getAdminResource = exports.getProfile = void 0;
const async_handler_util_1 = require("../utils/async-handler.util");
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