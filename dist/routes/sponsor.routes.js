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
const sponsorshipController = __importStar(require("../controllers/sponsorship.controller"));
const role_enum_1 = require("../enums/role.enum");
const authenticate_user_middleware_1 = require("../middlewares/authenticate-user.middleware");
const authorize_roles_middleware_1 = require("../middlewares/authorize-roles.middleware");
const require_active_session_middleware_1 = require("../middlewares/require-active-session.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const sponsor_validator_1 = require("../validators/sponsor.validator");
const router = (0, express_1.Router)();
router.post('/', authenticate_user_middleware_1.authenticateUser, (0, authorize_roles_middleware_1.authorizeRoles)(role_enum_1.Role.ORGANIZATION), require_active_session_middleware_1.requireActiveSession, (0, validate_middleware_1.validateBody)(sponsor_validator_1.SponsorDto), sponsorshipController.sponsor);
exports.default = router;
//# sourceMappingURL=sponsor.routes.js.map