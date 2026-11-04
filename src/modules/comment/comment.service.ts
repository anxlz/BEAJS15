import { Types } from "mongoose";
import { ForbiddenException, NotFoundException } from "../../common/exception/index.js";
import type { IComment, RawDocument } from "../../common/interface/index.js";
import { CommentRepository, PostRepository } from "../../common/repository/index.js";
import type { CreateCommentDto, UpdateCommentDto } from "./dto/index.js";

export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository = new CommentRepository(),
        private readonly postRepository: PostRepository = new PostRepository()
    ) {}

    private toComment(comment: RawDocument<IComment>) {
        return {
            id: String(comment._id),
            content: comment.content,
            postId: String(comment.postId),
            userId: String(comment.userId),
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        };
    }

    // Find Post
    private async getPostOrFail(postId: string) {
        const post = await this.postRepository.findById(postId, undefined, { lean: true });
        if (!post) {
            throw new NotFoundException("Post not found");
        }
        return post;
    }

    // Find Comment
    private async getCommentOrFail(commentId: string) {
        const comment = await this.commentRepository.findById(commentId, undefined, { lean: true });
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }
        return comment;
    }

    // ---------- 1. Create Comment ----------
    async createComment(userId: string, postId: string, dto: CreateCommentDto) {
        await this.getPostOrFail(postId);
        const comment = await this.commentRepository.create({
            content: dto.content,
            postId: new Types.ObjectId(postId),
            userId: new Types.ObjectId(userId)
        });
        return this.toComment(comment.toObject());
    }

    // ---------- 2. Get Post Comments ----------
    async getPostComments(postId: string) {
        await this.getPostOrFail(postId);
        const comments = await this.commentRepository.find({ postId }, undefined, { lean: true, sort: { createdAt: 1 } });
        return comments.map((comment) => this.toComment(comment));
    }

    // ---------- 3. Get Single Comment ----------
    async getComment(commentId: string) {
        const comment = await this.getCommentOrFail(commentId);
        return this.toComment(comment);
    }

    // ---------- 4. Update Comment ----------
    async updateComment(userId: string, commentId: string, dto: UpdateCommentDto) {
        const comment = await this.getCommentOrFail(commentId);
        if (String(comment.userId) !== userId) {
            throw new ForbiddenException("Only the comment owner can update it");
        }
        await this.commentRepository.updateOne({ _id: commentId }, { $set: { content: dto.content } });
        return await this.getComment(commentId);
    }

    // ---------- 5. Delete Comment ----------
    async deleteComment(userId: string, commentId: string) {
        const comment = await this.getCommentOrFail(commentId);
        const post = await this.getPostOrFail(String(comment.postId));

        // Comment Owner Or Post Owner
        const isCommentOwner = String(comment.userId) === userId;
        const isPostOwner = String(post.userId) === userId;
        if (!isCommentOwner && !isPostOwner) {
            throw new ForbiddenException("Only the comment owner or the post owner can delete it");
        }

        await this.commentRepository.updateOne(
            { _id: commentId },
            { $set: { deletedAt: new Date(), deletedBy: new Types.ObjectId(userId) } }
        );
        return { id: commentId };
    }
}

export const commentService = new CommentService();
