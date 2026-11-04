import { z } from "zod";
import { generalValidationFields } from "../../common/utils/validation.js";

const { objectId } = generalValidationFields;

const content = z.string().trim().min(1).max(2000);

export const createPost = z.object({
    body: z.strictObject({ content: content.optional() })
});

export const postIdOnly = z.object({
    params: z.strictObject({ postId: objectId })
});

export const updatePost = z.object({
    params: z.strictObject({ postId: objectId }),
    body: z.strictObject({ content: content.optional() })
});
