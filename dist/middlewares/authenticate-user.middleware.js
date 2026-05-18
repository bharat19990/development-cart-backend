"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
const errors_util_1 = require("../utils/errors.util");
function authenticateUser(req, _res, next) {
    if (!req.user) {
        next(new errors_util_1.UnauthorizedError('Invalid or missing token'));
        return;
    }
    next();
}
//# sourceMappingURL=authenticate-user.middleware.js.map