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
import {ipBlockMiddleware} from "../middlewares/ip-block-middleware";

export const authRouter = Router({})

authRouter.post('/login',
    ipBlockMiddleware('login'),
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
    ipBlockMiddleware('registration'),
    loginUsersValidation,
    emailUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(204).send(user)
    })

authRouter.post('/registration-confirmation',
    ipBlockMiddleware('registration-confirmation'),
    async (req: Request, res: Response) => {
        const result = await usersService.confirmUser(req.body.code)
        if (result) {
            res.send(204)
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
    ipBlockMiddleware('registration-email-resending'),
    emailUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersService.findUserByEmail(req.body.email)
        if (!user) {
            return res.send(400)
        } else {
            await emailAdapter.sendEmailConfirmationCode(user)
            res.send(204)
        }
    })
