"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionHistory = exports.getMyScores = exports.attemptQuiz = exports.watchVideo = void 0;
const learning_service_1 = require("../services/learning.service");
const errors_util_1 = require("../utils/errors.util");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.watchVideo = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.activeSession) {
        throw new errors_util_1.UnauthorizedError();
    }
    const result = await learning_service_1.learningService.watchVideo(req.user, req.activeSession, req.params.videoId);
    res.status(201).json({ message: 'Video watched', watch: result });
});
exports.attemptQuiz = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user || !req.activeSession) {
        throw new errors_util_1.UnauthorizedError();
    }
    const result = await learning_service_1.learningService.attemptQuiz(req.user, req.activeSession, req.params.quizId, req.body);
    res.status(201).json({ message: 'Quiz attempted', attempt: result });
});
exports.getMyScores = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errors_util_1.UnauthorizedError();
    }
    const sessionId = req.query.sessionId;
    const scores = await learning_service_1.learningService.getMyScores(req.user.id, sessionId);
    res.json({ scores });
});
exports.getSessionHistory = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errors_util_1.UnauthorizedError();
    }
    const sessionId = req.params.sessionId;
    if (!sessionId) {
        throw new errors_util_1.BadRequestError('sessionId is required');
    }
    const data = await learning_service_1.learningService.getHistoricalData(req.user.id, sessionId);
    res.json(data);
});
//# sourceMappingURL=learning.controller.js.map