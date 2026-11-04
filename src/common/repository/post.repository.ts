import { PostModel } from "../../DB/model/index.js";
import type { IPost } from "../interface/index.js";
import { BaseRepository } from "./base.repository.js";

export class PostRepository extends BaseRepository<IPost> {
    constructor() {
        super(PostModel);
    }
}
