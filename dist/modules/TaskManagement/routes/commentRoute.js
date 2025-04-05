"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const jwtMiddleware_1 = require("../../../middlewares/jwtMiddleware");
const router = express_1.default.Router();
// Create comment
router.post('/addcomment/:taskId', jwtMiddleware_1.authenticateJWT, commentController_1.createComment);
// list comments based on the tasks
router.get('/listcomments/:taskId', jwtMiddleware_1.authenticateJWT, commentController_1.listComments);
// update the the status based on the action
router.put('/updatestatus/:id', jwtMiddleware_1.authenticateJWT, commentController_1.updatestatus);
exports.default = router;
