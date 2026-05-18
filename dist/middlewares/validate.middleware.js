"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const errors_util_1 = require("../utils/errors.util");
const async_handler_util_1 = require("../utils/async-handler.util");
function validateBody(dtoClass) {
    return (0, async_handler_util_1.asyncHandler)(async (req, _res, next) => {
        const dto = (0, class_transformer_1.plainToInstance)(dtoClass, req.body, {
            enableImplicitConversion: true,
        });
        const errors = await (0, class_validator_1.validate)(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        if (errors.length > 0) {
            const messages = errors.flatMap((error) => Object.values(error.constraints ?? {}));
            throw new errors_util_1.ValidationRequestError(messages);
        }
        req.body = dto;
        next();
    });
}
//# sourceMappingURL=validate.middleware.js.map