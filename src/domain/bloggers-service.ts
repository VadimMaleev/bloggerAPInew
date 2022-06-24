import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerPagType, bloggersCollection, BloggerType} from "../repositories/db";

export const bloggersService = {
    async findAllBloggers(name: string | undefined, page: number, pageSize: number): Promise<BloggerPagType> {
        const pagesCount = Math.ceil(await bloggersRepository.forCount(name)/ pageSize)
        const totalCount = await bloggersRepository.forCount(name)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await bloggersRepository.findAllBloggers(name, page, pageSize)
        }
    },

    async findBloggerById (id: number): Promise<BloggerType | null> {
        return await bloggersRepository.findBloggerById(id)
    },
    async createBlogger (name: string, youtubeUrl: string): Promise<BloggerType> {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }

        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return createdBlogger
    },
    async deleteBlogger (id:number): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    },
    async updateBlogger (id:number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)

    }
}