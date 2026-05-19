"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toActivityDate = toActivityDate;
exports.addDays = addDays;
function toActivityDate(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}
//# sourceMappingURL=date.util.js.map