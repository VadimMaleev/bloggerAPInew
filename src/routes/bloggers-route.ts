import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";

export const bloggersRouter = Router ({})


bloggersRouter.get('/', (req: Request, res: Response) => {
    const bloggers = bloggersRepository.findAllBloggers()
    res.send(bloggers)
})

bloggersRouter.get ('/:id', (req: Request, res: Response) => {
    let blogger = bloggersRepository.findBloggerById(+req.params.id)
    if (blogger) {
        res.send(blogger).status(200)
    } else {
        res.send(404)
    }
})

bloggersRouter.post('/', (req: Request, res: Response) => {
    const newBlogger = bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)
    res.send(newBlogger).status(201)
})

bloggersRouter.delete('/:id',(req: Request, res: Response)=>{
    const isDeleted = bloggersRepository.deleteBlogger(+req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})

bloggersRouter.put('/:id',(req: Request, res: Response)=>{
    const isUpdated = bloggersRepository.updateBlogger(+req.params.id, req.body.name, req.body.youtubeUrl)
    if (isUpdated) {
       const blogger = bloggersRepository.findBloggerById(+req.params.id)
       res.send(blogger)
    } else {
        res.send(404)
    }
})
