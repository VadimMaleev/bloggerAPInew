import {bloggersCollection, BloggerType} from "./db";
import {Filter, ObjectId} from "mongodb";

export const bloggersRepository = {
    async forCount(name: string | null): Promise<number> {
        let filter: Filter<BloggerType> = {}
        if (name) {
            filter.name = {$regex: name}
        }
        return bloggersCollection.count(filter)

    },
    async findAllBloggers(name: string | null, page: number, pageSize: number): Promise<BloggerType[]> {
        let filter: Filter<BloggerType> = {}
        if (name) {
            filter.name = {$regex: name}
        }
        return bloggersCollection.find(filter, {projection: {_id: 0}})
            .skip(pageSize * (page - 1)).limit(pageSize).toArray()
    },
    async findBloggerById(id: string): Promise<BloggerType | null> {
        return await bloggersCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async createBlogger(newBlogger: BloggerType): Promise<BloggerType> {
        const bloggerTypeDb = {
            _id: new ObjectId,
            ...newBlogger
        }
        await bloggersCollection.insertOne(bloggerTypeDb)
        return newBlogger
    },
    async deleteBlogger(id: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1

    }
}
