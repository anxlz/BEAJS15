import { Router } from "express";
import { StorageApproachEnum } from "../../common/enum/index.js";
import { cloudFileUpload, fileValidation, successResponse } from "../../common/utils/index.js";
import { authentication, validation } from "../../middleware/index.js";
import { postService } from "./post.service.js";
import * as validators from "./post.validation.js";

const router = Router();

const uploadAttachments = cloudFileUpload({
    storageApproach: StorageApproachEnum.DISK,
    validation: fileValidation.image,
    maxSize: 5
}).array("attachments", 5);

router.use(authentication());

// 1. POST /post
router.post("/", uploadAttachments, validation(validators.createPost), async (req, res) => {
    const data = await postService.createPost(String(req.user._id), req.validate.body, req.files as Express.Multer.File[]);
    successResponse({ res, status: 201, message: "Post created", data });
});

// 2. GET /post
router.get("/", async (req, res) => {
    const data = await postService.getMyPosts(String(req.user._id));
    successResponse({ res, message: "Posts fetched", data });
});

// 3. GET /post/:postId
router.get("/:postId", validation(validators.postIdOnly), async (req, res) => {
    const data = await postService.getPost(req.validate.params.postId);
    successResponse({ res, message: "Post fetched", data });
});

// 4. PATCH /post/:postId
router.patch("/:postId", uploadAttachments, validation(validators.updatePost), async (req, res) => {
    const data = await postService.updatePost(
        String(req.user._id),
        req.validate.params.postId,
        req.validate.body,
        req.files as Express.Multer.File[]
    );
    successResponse({ res, message: "Post updated", data });
});

// 5. DELETE /post/:postId
router.delete("/:postId", validation(validators.postIdOnly), async (req, res) => {
    const data = await postService.deletePost(String(req.user._id), req.validate.params.postId);
    successResponse({ res, message: "Post deleted", data });
});

// 6. DELETE /post/:postId/force
router.delete("/:postId/force", validation(validators.postIdOnly), async (req, res) => {
    const data = await postService.forceDeletePost(String(req.user._id), req.validate.params.postId);
    successResponse({ res, message: "Post deleted forever", data });
});

export default router;
