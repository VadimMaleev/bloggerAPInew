import {postsRepository} from "../repositories/posts-db-repository";
import {bloggersCollection, PostType} from "../repositories/db";


export const postsService = {
    async findAllPosts(page: number, pageSize: number): Promise<PostType[]> {
        return postsRepository.findAllPosts(page, pageSize)
    },
    async findPostById(id: number): Promise<PostType | null> {
        return await postsRepository.findPostById(id)
    },
    async findPosts(bloggerId: number, page: number, pageSize: number) {
        return await postsRepository.findPosts(bloggerId, page, pageSize)
    },
    async createPost(title: string, shortDescription: string,
                     content: string, bloggerId: number): Promise<PostType | null> {
        if (bloggerId) {
            const blogger = await bloggersCollection.findOne({id: bloggerId})
            if (!blogger) {
                return null
            }

            const newPost = {
                id: +(new Date()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: blogger.name
            }
            const createdPost  = await postsRepository.createPost(newPost)
            return createdPost
        } else {
            return null
        }
    },
    async deletePost(id: number): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
    async updatePost(id: number, title: string, shortDescription: string,
                     content: string, bloggerId: number): Promise<boolean | undefined> {
        return await postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    }
}