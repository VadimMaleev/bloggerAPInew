import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerPagType, bloggersCollection, BloggerType} from "../repositories/db";

export const bloggersService = {
    async findBloggers(name: string, page: number, pageSize: number): Promise<BloggerPagType> {
        return {
            pagesCount: Math.ceil(await bloggersRepository.forCount(name)/ pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: await bloggersRepository.forCount(name),
            items: await bloggersRepository.findBloggers(name, page, pageSize)
        }

    },
    async findAllBloggers(page: number, pageSize: number): Promise<BloggerPagType[]> {
        return {
            pagesCount: Math.ceil(await bloggersRepository.forCount(name)/ pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: await bloggersRepository.forCount(name),
            items: await bloggersRepository.findAllBloggers(page, pageSize)
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