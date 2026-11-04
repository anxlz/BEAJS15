import type { Schema } from "mongoose";

export const softDeleteHooks = (schema: Schema<any>): void => {
    schema.pre(["find", "findOne", "countDocuments", "updateOne", "updateMany", "findOneAndUpdate"], function () {
        const { paranoid, ...query } = this.getQuery();
        this.setQuery(paranoid === false ? query : { ...query, deletedAt: { $exists: false } });
    });
};
