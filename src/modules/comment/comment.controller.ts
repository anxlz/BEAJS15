import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { authentication, validation } from "../../middleware/index.js";
import { commentService } from "./comment.service.js";
import * as validators from "./comment.validation.js";

const router = Router();

router.use(authentication());

// 1. POST /comment/post/:postId
router.post("/post/:postId", validation(validators.createComment), async (req, res) => {
    const data = await commentService.createComment(String(req.user._id), req.validate.params.postId, req.validate.body);
    successResponse({ res, status: 201, message: "Comment created", data });
});

// 2. GET /comment/post/:postId
router.get("/post/:postId", validation(validators.postIdOnly), async (req, res) => {
    const data = await commentService.getPostComments(req.validate.params.postId);
    successResponse({ res, message: "Comments fetched", data });
});

// 3. GET /comment/:commentId
router.get("/:commentId", validation(validators.commentIdOnly), async (req, res) => {
    const data = await commentService.getComment(req.validate.params.commentId);
    successResponse({ res, message: "Comment fetched", data });
});

// 4. PATCH /comment/:commentId
router.patch("/:commentId", validation(validators.updateComment), async (req, res) => {
    const data = await commentService.updateComment(String(req.user._id), req.validate.params.commentId, req.validate.body);
    successResponse({ res, message: "Comment updated", data });
});

// 5. DELETE /comment/:commentId
router.delete("/:commentId", validation(validators.commentIdOnly), async (req, res) => {
    const data = await commentService.deleteComment(String(req.user._id), req.validate.params.commentId);
    successResponse({ res, message: "Comment deleted", data });
});

export default router;
