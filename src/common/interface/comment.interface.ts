import type { Types } from "mongoose";

export interface IComment {
    content: string;
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
