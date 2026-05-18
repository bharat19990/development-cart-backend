"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = authorizeRoles;
const errors_util_1 = require("../utils/errors.util");
function authorizeRoles(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            next(new errors_util_1.ForbiddenError('Access denied'));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new errors_util_1.ForbiddenError(`Required role(s): ${roles.join(', ')}`));
            return;
        }
        next();
    };
}
//# sourceMappingURL=authorize-roles.middleware.js.map