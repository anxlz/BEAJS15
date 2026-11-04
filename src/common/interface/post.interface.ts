import type { Types } from "mongoose";

export interface IPost {
    content?: string;
    attachments?: string[];
    userId: Types.ObjectId;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
