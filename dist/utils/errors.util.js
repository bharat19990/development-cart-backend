"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRequestError = exports.ForbiddenError = exports.UnauthorizedError = exports.ConflictError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    messages;
    constructor(statusCode, messages) {
        super(Array.isArray(messages) ? messages.join(', ') : messages);
        this.statusCode = statusCode;
        this.messages = messages;
        this.name = this.constructor.name;
    }
}
exports.AppError = AppError;
class ConflictError extends AppError {
    constructor(message) {
        super(409, message);
    }
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends AppError {
    constructor(message = 'Invalid or missing token') {
        super(401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message) {
        super(403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class ValidationRequestError extends AppError {
    constructor(messages) {
        super(400, messages);
    }
}
exports.ValidationRequestError = ValidationRequestError;
//# sourceMappingURL=errors.util.js.map