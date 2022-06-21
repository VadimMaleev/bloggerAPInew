import {bloggersCollection, postsCollection, PostType} from "./db";


export const postsRepository = {
    async findAllPosts(): Promise<PostType[]> {
        return await postsCollection.find({}, {projection:{_id:0}}).toArray()
    },
    async findPostById(id: number): Promise<PostType | null> {
        return await postsCollection.findOne({id: id}, {projection:{_id:0}})
    },
    async findPosts(bloggerId: number) {
        if (bloggerId) {
            return await postsCollection.find({bloggerId}, {projection: {_id: 0}}).toArray();
        } else {
            return await postsCollection.find({}, {projection:{_id:0}}).toArray()
        }
    },
    async createPost(newPost: PostType): Promise<PostType | null> {
        await postsCollection.insertOne(newPost)
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