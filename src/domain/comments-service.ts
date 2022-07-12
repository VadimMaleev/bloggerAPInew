import {postsRepository} from "../repositories/posts-db-repository";
import {CommentPagType, CommentType} from "../repositories/db";
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
    async createComment(id: string, content: string, userId: string, login: string): Promise<CommentType | null> {
        const post = await postsRepository.findPostById(id)
        if (post) {
            const newComment = {
                postId: id,
                id: (+(new Date())).toString(),
                content: content,
                userId: userId,
                userLogin: login,
                addedAt: Date()
            }
            const createdComment = await commentsRepository.createComment(newComment, id)
            return createdComment
        } else {
            return null
        }
    }
}