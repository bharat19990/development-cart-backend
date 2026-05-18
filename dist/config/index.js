"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.configuration = void 0;
var configuration_1 = require("./configuration");
Object.defineProperty(exports, "configuration", { enumerable: true, get: function () { return __importDefault(configuration_1).default; } });
var env_validation_1 = require("./env.validation");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return env_validation_1.validate; } });
//# sourceMappingURL=index.js.map