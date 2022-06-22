import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerType} from "../repositories/db";

export const bloggersService = {
    async findBloggers(name: string | null| undefined) {
        return await bloggersRepository.findBloggers(name)
    },
    async findAllBloggers(page: number, pageSize: number): Promise<BloggerType[]> {
        return await bloggersRepository.findAllBloggers(page, pageSize)
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