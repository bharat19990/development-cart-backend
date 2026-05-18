"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const enroll_routes_1 = __importDefault(require("./enroll.routes"));
const health_routes_1 = __importDefault(require("./health.routes"));
const session_routes_1 = __importDefault(require("./session.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const router = (0, express_1.Router)();
router.use('/', health_routes_1.default);
router.use('/auth', auth_routes_1.default);
router.use('/users', users_routes_1.default);
router.use('/sessions', session_routes_1.default);
router.use('/enroll', enroll_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map