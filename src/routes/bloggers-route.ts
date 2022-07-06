import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {postsService} from "../domain/posts-service";
import {
    nameBloggersValidation,
    youtubeUrlBloggersValidation
} from "../middlewares/bloggers-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authMiddleware} from "../middlewares/authorization-middware";
import {
    contentPostsValidation,
    shortDescriptionPostValidation,
    titlePostValidation
} from "../middlewares/posts-validation-middleware";


export const bloggersRouter = Router({})


bloggersRouter.get('/', async (req: Request, res: Response) => {
    const page = isNaN(Number(req.query.PageNumber))? 1: +req.query.PageNumber!
    const pageSize = isNaN(Number(req.query.PageSize))? 10: +req.query.PageSize!
    const name = req.query.SearchNameTerm?.toString() || null

    const bloggers =  await bloggersService.findAllBloggers(name, page, pageSize)
    return res.send(bloggers)
})

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    let blogger = await bloggersService.findBloggerById(req.params.id)
    if (blogger) {
        res.send(blogger).status(200)
    } else {
        res.send(404)
    }
})

bloggersRouter.post('/',
    authMiddleware,
    youtubeUrlBloggersValidation,
    nameBloggersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    })

bloggersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersService.deleteBlogger(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })

bloggersRouter.put('/:id',
    authMiddleware,
    youtubeUrlBloggersValidation,
    nameBloggersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated = await bloggersService.updateBlogger(req.params.id, req.body.name, req.body.youtubeUrl)
        if (isUpdated) {
            const blogger = await bloggersService.findBloggerById(req.params.id)
            res.status(204).send(blogger)
        } else {
            res.send(404)
        }
    })

//New Post for Blogger
bloggersRouter.post('/:bloggerId/posts',
    authMiddleware,
    titlePostValidation,
    shortDescriptionPostValidation,
    contentPostsValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const newPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.bloggerId)
        if (newPost === null) {
            res.send(404)
        } else {
            res.status(201).send(newPost)
        }
    })

//Get Posts from Blogger
bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    const page = isNaN(Number(req.query.PageNumber))? 1: +req.query.PageNumber!
    const pageSize = isNaN(Number(req.query.PageSize))? 10: +req.query.PageSize!
    const id = req.params.bloggerId
    const foundPosts = await postsService.findPosts(id, page, pageSize)

    if (foundPosts === null) {
        res.send(404)
    } else {
        res.send(foundPosts)
    }
})