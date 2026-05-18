"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionEntity = void 0;
class SessionEntity {
    id;
    title;
    description;
    status;
    adminId;
    organizationId;
    startsAt;
    endsAt;
    createdAt;
    updatedAt;
    admin;
    organization;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.SessionEntity = SessionEntity;
//# sourceMappingURL=session.entity.js.map