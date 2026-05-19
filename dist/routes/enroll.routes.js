"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enrollmentController = __importStar(require("../controllers/enrollment.controller"));
const authenticate_user_middleware_1 = require("../middlewares/authenticate-user.middleware");
const require_active_session_middleware_1 = require("../middlewares/require-active-session.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const enroll_validator_1 = require("../validators/enroll.validator");
const router = (0, express_1.Router)();
router.post('/', authenticate_user_middleware_1.authenticateUser, require_active_session_middleware_1.requireActiveSession, (0, validate_middleware_1.validateBody)(enroll_validator_1.EnrollDto), enrollmentController.enroll);
router.get('/history', authenticate_user_middleware_1.authenticateUser, enrollmentController.getMyEnrollments);
exports.default = router;
//# sourceMappingURL=enroll.routes.js.map