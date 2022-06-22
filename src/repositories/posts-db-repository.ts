import {postsCollection, PostType} from "./db";
import {ObjectId} from "mongodb";
import {postsService} from "../domain/posts-service";


export const postsRepository = {
    async findAllPosts(page: number, pageSize: number): Promise<PostType[]> {
        return await postsCollection.find({}, {projection:{_id:0}})
            .skip(pageSize*(page-1)).limit(pageSize).toArray()
    },
    async findPostById(id: number): Promise<PostType | null> {
        return await postsCollection.findOne({id: id}, {projection:{_id:0}})
    },
    async findPosts(bloggerId: number, page: number, pageSize: number) {
        if (bloggerId) {
            return await postsCollection.find({bloggerId}, {projection: {_id: 0}})
                .skip(pageSize*(page-1)).limit(pageSize).toArray();
        } else {
            return await postsCollection.find({}, {projection:{_id:0}})
                .skip(pageSize*(page-1)).limit(pageSize).toArray()
        }
    },
    async createPost(newPost: PostType): Promise<PostType | null> {
        const postTypeDb = {
            _id: new ObjectId,
            ... newPost
        }
        await postsCollection.insertOne(postTypeDb)
        return newPost
    },
    async deletePost(id: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async updatePost(id: number, title: string, shortDescription: string,
                     content: string, bloggerId: number): Promise<boolean | undefined> {
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