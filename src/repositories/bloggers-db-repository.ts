import {bloggersCollection, BloggerType} from "./db";

export const bloggersRepository = {
    async findBloggers(name: string | null | undefined) {
        let filter: any = {}
        if (name) {
           filter.name = {$regex: name}
        }
        return await bloggersCollection.find(filter, {projection:{_id:0}}).toArray()
    },
    async findAllBloggers(): Promise<BloggerType[]> {
        return await bloggersCollection.find({}, {projection:{_id:0}}).toArray()
    },
    async findBloggerById (id: number): Promise<BloggerType | null> {
        return await bloggersCollection.findOne({id: id}, {projection:{_id:0}})
    },
    async createBlogger (newBlogger: BloggerType): Promise<BloggerType> {
        await bloggersCollection.insertOne(newBlogger)
        return newBlogger
    },
    async deleteBlogger (id:number): Promise<boolean> {
        const result =  await bloggersCollection.deleteOne({id: id})
        return result.deletedCount === 1 
    },
    async updateBlogger (id:number, name: string, youtubeUrl: string): Promise<boolean> {
        const result =  await bloggersCollection.updateOne({id: id}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1

    }
}
