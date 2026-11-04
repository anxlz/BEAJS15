import { model, Schema } from "mongoose";
import type { IPost } from "../../common/interface/index.js";
import { softDeleteHooks } from "./soft-delete.js";

const postSchema = new Schema<IPost>(
    {
        content: { type: String, maxlength: 2000, trim: true },
        attachments: [{ type: String }],
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        deletedAt: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

postSchema.index({ userId: 1, createdAt: -1 });
softDeleteHooks(postSchema);

export const PostModel = model<IPost>("Post", postSchema);
