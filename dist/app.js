"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const extract_user_middleware_1 = require("./middlewares/extract-user.middleware");
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
const routes_1 = __importDefault(require("./routes"));
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(extract_user_middleware_1.extractUser);
    app.use(routes_1.default);
    app.use(error_handler_middleware_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map