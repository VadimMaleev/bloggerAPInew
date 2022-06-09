import {Request, Response, Router} from "express";

export const bloggersRouter = Router ({})


export const bloggers: Array<{ id: number, name: string, youtubeUrl: string}> = []

bloggersRouter.get('/', (req: Request, res: Response) => {
    res.send(bloggers)
})

bloggersRouter.get ('/:id', (req: Request, res: Response) => {
    let blogger = bloggers.find(b => b.id === +req.params.id)
    if (blogger) {
        res.status(200).send(blogger)
    } else {
        res.send(404)
    }
})

bloggersRouter.post('/', (req: Request, res: Response) => {
    const newBlogger = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.send(newBlogger).status(201)
})

bloggersRouter.delete('/:id',(req: Request, res: Response)=>{
    for (let i=0; i<bloggers.length; i++) {
        if (bloggers[i].id === +req.params.id) {
            bloggers.splice(i, 1)
            res.send(204)
            return
        }
    }
    res.send(404)
})

bloggersRouter.put('/:id',(req: Request, res: Response)=>{
    let blogger = bloggers.find(v => v.id === +req.params.id)
    if (blogger) {
        blogger.name = req.body.name
        blogger.youtubeUrl = req.body.youtubeUrl
        res.send(blogger).status(201)
    } else {
        res.send(404)
    }
})
