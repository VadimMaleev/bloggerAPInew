import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {
    emailUsersValidation,
    loginUsersValidation,
    passwordUsersValidation
} from "../middlewares/users-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authMiddleware} from "../middlewares/authorization-middware";
import {ObjectId} from "mongodb";


export const usersRouter = Router({})

usersRouter.get('/', async(req: Request, res: Response) => {
    const page = isNaN(Number(req.query.PageNumber))? 1: +req.query.PageNumber!
    const pageSize = isNaN(Number(req.query.PageSize))? 10: +req.query.PageSize!

    const users = await usersService.findAllUsers(page, pageSize)
    res.status(200).send(users)
})

usersRouter.post ('/',
    authMiddleware,
    loginUsersValidation,
    emailUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
    res.status(201).send(newUser)
})

usersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.id)
        const isDeleted = await usersService.deleteUser(userId)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })