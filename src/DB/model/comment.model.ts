import { model, Schema } from "mongoose";
import type { IComment } from "../../common/interface/index.js";
import { softDeleteHooks } from "./soft-delete.js";

const commentSchema = new Schema<IComment>(
    {
        content: { type: String, required: true, minlength: 1, maxlength: 1000, trim: true },
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        deletedAt: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });
softDeleteHooks(commentSchema);

export const CommentModel = model<IComment>("Comment", commentSchema);
