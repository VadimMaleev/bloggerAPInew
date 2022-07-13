import {postsRepository} from "../repositories/posts-db-repository";
import {CommentDto, CommentPagType, CommentType} from "../repositories/db";
import {commentsRepository} from "../repositories/comments-repository";


export const commentsService = {
    async findCommentsForPost(page: number, pageSize: number, id: string): Promise<CommentPagType | null> {
        const pagesCount = Math.ceil(await commentsRepository.forCount(id) / pageSize)
        const totalCount = await commentsRepository.forCount(id)
        const post = await postsRepository.findPostById(id)
        if (post) {
            return {
                pagesCount: pagesCount,
                page: page,
                pageSize: pageSize,
                totalCount: totalCount,
                items: await commentsRepository.findCommentsForPost(id, page, pageSize)
            }
        } else {
            return null
        }
    },
    async createComment(id: string, content: string, userId: string, login: string): Promise<CommentDto | null> {
        const post = await postsRepository.findPostById(id)
        if (post) {
            const newComment: CommentType = {
                id: (+(new Date())).toString(),
                postId: id,
                content: content,
                userId: userId,
                userLogin: login,
                addedAt: new Date().toString()
            }
            await commentsRepository.createComment(newComment)

            const commentDto: CommentDto = {
                id: newComment.id,
                content: newComment.content,
                userId: newComment.userId,
                userLogin: newComment.userLogin,
                addedAt: newComment.addedAt
            }

            return commentDto
        } else {
            return null
        }
    },
    async findCommentById(id: string): Promise<CommentType | null> {
        return await commentsRepository.findCommentById(id)
    },
    async updateComment(id: string, content: string): Promise<boolean | undefined> {
        return await commentsRepository.updateComment(id, content)
    },
    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    }
}