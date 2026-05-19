"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireProfileCompleted = void 0;
const errors_util_1 = require("../utils/errors.util");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.requireProfileCompleted = (0, async_handler_util_1.asyncHandler)(async (req, _res, next) => {
    if (!req.user?.profileCompleted) {
        next(new errors_util_1.ForbiddenError('Complete your profile before accessing learning features'));
        return;
    }
    next();
});
//# sourceMappingURL=require-profile-completed.middleware.js.map