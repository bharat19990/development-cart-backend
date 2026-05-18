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
const usersController = __importStar(require("../controllers/users.controller"));
const authenticate_user_middleware_1 = require("../middlewares/authenticate-user.middleware");
const authorize_roles_middleware_1 = require("../middlewares/authorize-roles.middleware");
const require_active_session_middleware_1 = require("../middlewares/require-active-session.middleware");
const role_enum_1 = require("../enums/role.enum");
const router = (0, express_1.Router)();
router.post('/complete-profile', authenticate_user_middleware_1.authenticateUser, require_active_session_middleware_1.requireActiveSession, usersController.completeProfile);
router.get('/me', authenticate_user_middleware_1.authenticateUser, usersController.getProfile);
router.get('/admin', authenticate_user_middleware_1.authenticateUser, (0, authorize_roles_middleware_1.authorizeRoles)(role_enum_1.Role.ADMIN, role_enum_1.Role.SUPERADMIN), usersController.getAdminResource);
router.get('/organization', authenticate_user_middleware_1.authenticateUser, (0, authorize_roles_middleware_1.authorizeRoles)(role_enum_1.Role.ORGANIZATION), usersController.getOrganizationResource);
exports.default = router;
//# sourceMappingURL=users.routes.js.map