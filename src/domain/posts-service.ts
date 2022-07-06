import {postsRepository} from "../repositories/posts-db-repository";
import {bloggersCollection, PostPagType, PostType} from "../repositories/db";
import {bloggersRepository} from "../repositories/bloggers-db-repository";


export const postsService = {
    async findAllPosts(page: number, pageSize: number): Promise<PostPagType> {
        const pagesCount = Math.ceil(await postsRepository.forCount() / pageSize)
        const totalCount = await postsRepository.forCount()
        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await postsRepository.findAllPosts(page, pageSize)
        }
    },
    async findPostById(id: string): Promise<PostType | null> {
        return await postsRepository.findPostById(id)
    },
    async findPosts(id: string, page: number, pageSize: number): Promise<PostPagType | null > {
        const pagesCount = Math.ceil(await postsRepository.forCountId(id) / pageSize)
        const totalCount = await postsRepository.forCountId(id)
        const blogger = await bloggersRepository.findBloggerById(id)
        if (blogger) {
            return {
                pagesCount: pagesCount,
                page: page,
                pageSize: pageSize,
                totalCount: totalCount,
                items: await postsRepository.findPosts(id, page, pageSize)
            }
        } else {
            return null
        }
    },
    async createPost(title: string, shortDescription: string,
                     content: string, bloggerId: string): Promise<PostType | null> {

        if (bloggerId) {
            const blogger = await bloggersCollection.findOne({id: bloggerId})
            if (!blogger) {
                return null
            }
            const newPost = {
                id: (+(new Date())).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: blogger.name
            }
            const createdPost = await postsRepository.createPost(newPost)
            return createdPost
        } else {
            return null
        }
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
    async updatePost(id: string, title: string, shortDescription: string,
                     content: string, bloggerId: string): Promise<boolean | undefined> {
        return await postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    }
}