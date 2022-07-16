import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {jwtAuthMiddleware} from "../middlewares/authorization-middware";
import {commentsValidation} from "../middlewares/comments-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentsService.findCommentById(req.params.id)
    if (comment) {
        res.status(200).send(comment)
    } else {
        res.send(404)
    }
})

commentsRouter.put('/:id',
    jwtAuthMiddleware,
    commentsValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const comment = await commentsService.findCommentById(req.params.id)
        if (!comment) {
            return res.send(404)
        }
        if (comment.userId !== req.user!._id.toString()) {
            return res.send(403)
        }
        const isUpdated = await commentsService.updateComment(req.params.id, req.body.content)
        if (isUpdated) {
            const comment = await commentsService.findCommentById(req.params.id)
            res.status(204).send(comment)
        } else {
            res.send(404)
        }
    })

commentsRouter.delete('/:id',
    jwtAuthMiddleware,
    async (req: Request, res: Response) => {
        const comment = await commentsService.findCommentById(req.params.id)
        if (!comment) {
            return res.status(404).send()
        }
        if (comment.userId !== req.user!._id.toString()) {
            return res.status(403).send()
        }
        const isDeleted = await commentsService.deleteComment(req.params.id)
        if (isDeleted) {
            res.status(204).send()
        } else {
            res.status(404).send()
        }
    })