import {Request, Response, Router} from "express";
import {
    emailUsersValidation,
    loginUsersValidation,
    passwordUsersValidation
} from "../middlewares/users-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authService} from "../domain/auth-service";
import {loginAndPassAuthMiddleware} from "../middlewares/login-and-pass-auth-middleware";
import {emailAdapter} from "../adapters/email-adapter";
import {usersService} from "../domain/users-service";

export const authRouter = Router({})

authRouter.post('/login',
    loginAndPassAuthMiddleware,
    loginUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const token = await authService.createToken(req.body.login)
        if (token === null) {
            res.status(400).send
        } else {
            res.status(200).send(token)
        }
    })

authRouter.post('/registration',
    loginUsersValidation,
    emailUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(204).send(user)
    })

authRouter.post('/registration-confirmation',
    async (req: Request, res: Response) => {
        const result = await usersService.confirmUser(req.body.code)
        if (result) {
            res.status(204).send
        } else {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "confirm code error",
                        field: "code"
                    }
                ]
            })
        }
    })

authRouter.post('/registration-email-resending',
    emailUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersService.findUserByEmail(req.body.email)
        if (!user) {
            return res.status(400).send
        } else {
            await emailAdapter.sendEmailConfirmationCode(user)
            res.status(204).send
        }
    })
