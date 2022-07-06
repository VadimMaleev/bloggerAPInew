import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerPagType, BloggerType} from "../repositories/db";

export const bloggersService = {
    async findAllBloggers(name: string | null, page: number, pageSize: number): Promise<BloggerPagType> {
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

    async findBloggerById (id: string): Promise<BloggerType | null> {
        return await bloggersRepository.findBloggerById(id)
    },
    async createBlogger (name: string, youtubeUrl: string): Promise<BloggerType> {
        const newBlogger = {
            id: (+(new Date())).toString(),
            name: name,
            youtubeUrl: youtubeUrl
        }

        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return createdBlogger
    },
    async deleteBlogger (id:string): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    },
    async updateBlogger (id:string, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)

    }
}