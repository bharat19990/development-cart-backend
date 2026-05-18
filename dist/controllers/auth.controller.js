"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.register = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    const result = await auth_service_1.authService.register(req.body);
    res.status(201).json(result);
});
exports.login = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    const result = await auth_service_1.authService.login(req.body);
    res.status(200).json(result);
});
//# sourceMappingURL=auth.controller.js.map