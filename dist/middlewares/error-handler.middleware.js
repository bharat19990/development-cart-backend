"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_util_1 = require("../utils/errors.util");
function errorHandler(err, req, res, _next) {
    const statusCode = err instanceof errors_util_1.AppError ? err.statusCode : 500;
    let message;
    if (err instanceof errors_util_1.AppError) {
        message = err.messages;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    else {
        message = 'Internal server error';
    }
    if (statusCode >= 500) {
        console.error(`${req.method} ${req.url}`, err);
    }
    res.status(statusCode).json({
        statusCode,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
        message,
    });
}
//# sourceMappingURL=error-handler.middleware.js.map