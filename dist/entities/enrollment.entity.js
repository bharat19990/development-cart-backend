"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentEntity = void 0;
class EnrollmentEntity {
    id;
    userId;
    sessionId;
    paymentType;
    paymentStatus;
    enrolledAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.EnrollmentEntity = EnrollmentEntity;
//# sourceMappingURL=enrollment.entity.js.map