"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContent = exports.addQuiz = exports.addVideo = void 0;
const content_service_1 = require("../services/content.service");
const errors_util_1 = require("../utils/errors.util");
const async_handler_util_1 = require("../utils/async-handler.util");
exports.addVideo = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errors_util_1.UnauthorizedError();
    }
    const video = await content_service_1.contentService.addVideo(req.user, req.body);
    res.status(201).json({ message: 'Video added', video });
});
exports.addQuiz = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new errors_util_1.UnauthorizedError();
    }
    const quiz = await content_service_1.contentService.addQuiz(req.user, req.body);
    res.status(201).json({ message: 'Quiz added', quiz });
});
exports.listContent = (0, async_handler_util_1.asyncHandler)(async (req, res) => {
    const sessionId = req.params.sessionId;
    const content = await content_service_1.contentService.listSessionContent(sessionId);
    res.json(content);
});
//# sourceMappingURL=content.controller.js.map