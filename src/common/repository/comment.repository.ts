import { CommentModel } from "../../DB/model/index.js";
import type { IComment } from "../interface/index.js";
import { BaseRepository } from "./base.repository.js";

export class CommentRepository extends BaseRepository<IComment> {
    constructor() {
        super(CommentModel);
    }
}
