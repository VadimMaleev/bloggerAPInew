import {postsCollection, PostType} from "./db";
import {ObjectId} from "mongodb";


export const postsRepository = {
    async forCount(): Promise<number> {
        return postsCollection.countDocuments()
    },
    async forCountId(id: string) {
        return postsCollection.countDocuments({bloggerId: id})
    },
    async findAllPosts(page: number, pageSize: number): Promise<PostType[]> {
        return await postsCollection.find({}, {projection: {_id: 0}})
            .skip(pageSize * (page - 1)).limit(pageSize).toArray()
    },
    async findPostById(id: string): Promise<PostType | null> {
        return await postsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async findPosts(id: string, page: number, pageSize: number): Promise<PostType[]> {
            return postsCollection.find({bloggerId: id}, {projection: {_id: 0}})
                .skip(pageSize * (page - 1)).limit(pageSize).toArray();
    },
    async createPost(newPost: PostType): Promise<PostType> {
        const postTypeDb = {
            _id: new ObjectId,
            ...newPost
        }
        await postsCollection.insertOne(postTypeDb)
        return newPost
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async updatePost(id: string, title: string, shortDescription: string,
                     content: string, bloggerId: string): Promise<boolean | undefined> {
        const result = await postsCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId
            }
        })
        return result.matchedCount === 1
    }
}