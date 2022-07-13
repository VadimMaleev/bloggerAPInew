import {commentsCollection, CommentType} from "./db";
import {ObjectId} from "mongodb";
import {create} from "domain";

export const commentsRepository = {

    async forCount(id: string): Promise <number> {
        return commentsCollection.countDocuments({postId: id})
    },
    async findCommentsForPost(id: string, page: number, pageSize: number): Promise <CommentType[]> {
        return commentsCollection.find({postId: id}, {projection: {_id: 0, postId:0}})
            .skip(pageSize * (page - 1)).limit(pageSize).toArray();
    },
    async createComment(newComment: CommentType) {
        await commentsCollection.insertOne(newComment)
    },
    async findCommentById(id: string): Promise<CommentType | null> {
        return await commentsCollection.findOne({id:id}, {projection: {_id: 0, postId: 0}})
    },
    async updateComment(id: string, content: string): Promise <boolean | undefined> {
        const result = await commentsCollection.updateOne({id: id}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}