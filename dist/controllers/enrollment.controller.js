"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyEnrollments = exports.enroll = void 0;
const enrollment_service_1 = require("../services/enrollment.service");
const errors_util_1 = require("../utils/errors.util");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.enroll = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errors_util_1.UnauthorizedError();
    }
    if (!req.activeSession) {
        throw new errors_util_1.BadRequestError('Active session context is missing');
    }
    const enrollment = await enrollment_service_1.enrollmentService.enroll(req.user, req.activeSession, req.body);
    res.status(201).json({
        message: 'Enrolled successfully',
        enrollment,
        session: req.activeSession,
    });
});
exports.getMyEnrollments = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errors_util_1.UnauthorizedError();
    }
    const enrollments = await enrollment_service_1.enrollmentService.getMyEnrollments(req.user.id);
    res.json({ enrollments });
});
//# sourceMappingURL=enrollment.controller.js.map