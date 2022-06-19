import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {
    nameBloggersValidation,
    youtubeUrlBloggersValidation
} from "../middlewares/bloggers-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authMiddleware} from "../middlewares/authorization-middware";

export const bloggersRouter = Router ({})



bloggersRouter.get('/', async (req: Request, res: Response) => {
    const bloggers = await bloggersRepository.findAllBloggers()
    res.send(bloggers)
})

bloggersRouter.get ('/:id', async (req: Request, res: Response) => {
    let blogger = await bloggersRepository.findBloggerById(+req.params.id)
    if (blogger) {
        res.send(blogger).status(200)
    } else {
        res.send(404)
    }
})

bloggersRouter.post('/',
    authMiddleware,
    nameBloggersValidation,
    youtubeUrlBloggersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const newBlogger = await bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    })

bloggersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersRepository.deleteBlogger(+req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })

bloggersRouter.put('/:id',
    authMiddleware,
    nameBloggersValidation,
    youtubeUrlBloggersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated = await bloggersRepository.updateBlogger(+req.params.id, req.body.name, req.body.youtubeUrl)
        if (isUpdated) {
            const blogger = await bloggersRepository.findBloggerById(+req.params.id)
            res.status(204).send(blogger)
        } else {
            res.send(404)
        }
    })
