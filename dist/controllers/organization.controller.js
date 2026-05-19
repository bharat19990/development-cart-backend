"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = void 0;
const organization_service_1 = require("../services/organization.service");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.createOrganization = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    const result = await organization_service_1.organizationService.create(req.body);
    res.status(201).json({
        message: 'Organization created',
        ...result,
    });
});
//# sourceMappingURL=organization.controller.js.map