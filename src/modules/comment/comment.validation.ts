import { z } from "zod";
import { generalValidationFields } from "../../common/utils/validation.js";

const { objectId } = generalValidationFields;

const content = z.string().trim().min(1).max(1000);

export const createComment = z.object({
    params: z.strictObject({ postId: objectId }),
    body: z.strictObject({ content })
});

export const postIdOnly = z.object({
    params: z.strictObject({ postId: objectId })
});

export const commentIdOnly = z.object({
    params: z.strictObject({ commentId: objectId })
});

export const updateComment = z.object({
    params: z.strictObject({ commentId: objectId }),
    body: z.strictObject({ content })
});
