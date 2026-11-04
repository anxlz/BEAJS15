import { z } from "zod";
import * as validators from "../comment.validation.js";

export type CreateCommentDto = z.infer<typeof validators.createComment>["body"];
export type UpdateCommentDto = z.infer<typeof validators.updateComment>["body"];
