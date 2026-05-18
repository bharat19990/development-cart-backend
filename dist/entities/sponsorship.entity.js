"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorshipEntity = void 0;
class SponsorshipEntity {
    id;
    organizationId;
    userId;
    sessionId;
    enrollmentId;
    amount;
    paymentStatus;
    sponsoredAt;
    createdAt;
    updatedAt;
    enrollment;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.SponsorshipEntity = SponsorshipEntity;
//# sourceMappingURL=sponsorship.entity.js.map