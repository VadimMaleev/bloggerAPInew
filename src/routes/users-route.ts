import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {loginUsersValidation, passwordUsersValidation} from "../middlewares/users-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authMiddleware} from "../middlewares/authorization-middware";


export const usersRouter = Router({})

usersRouter.get('/', async(req: Request, res: Response) => {
    const page = isNaN(Number(req.query.PageNumber))? 1: +req.query.PageNumber!
    const pageSize = isNaN(Number(req.query.PageSize))? 10: +req.query.PageSize!

    const users = await usersService.findAllUsers(page, pageSize)
    res.status(200).send(users)
})

usersRouter.post ('/',
    loginUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body.login, req.body.password)
    res.status(201).send(newUser)
})

usersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await usersService.deleteUser(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })