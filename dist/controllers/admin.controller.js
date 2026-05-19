"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const admin_service_1 = require("../services/admin.service");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.createAdmin = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    const admin = await admin_service_1.adminService.createAdmin(req.body);
    res.status(201).json({ message: 'Admin created', user: admin });
});
//# sourceMappingURL=admin.controller.js.map