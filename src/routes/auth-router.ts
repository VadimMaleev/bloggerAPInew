import {Request, Response, Router} from "express";
import {
    emailUsersValidation,
    loginUsersValidation,
    passwordUsersValidation
} from "../middlewares/users-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authService} from "../domain/auth-service";
import {loginAndPassAuthMiddleware} from "../middlewares/login-and-pass-auth-middleware";
import {usersService} from "../domain/users-service";
import {ipBlockMiddleware} from "../middlewares/ip-block-middleware";
import {jwtAuthMiddleware, jwtRefreshAuthMiddleware} from "../middlewares/authorization-middware";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router({})

authRouter.post('/login',
    ipBlockMiddleware('login'),
    loginAndPassAuthMiddleware,
    loginUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const accessToken = await authService.createToken(req.body.login)
        const refreshToken = await authService.createRefreshToken(req.body.login)
        if (accessToken === null || refreshToken === null) {
            return res.sendStatus(400)
        } else {
            return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true}).send(accessToken)
        }
    })

authRouter.post('/registration',
    ipBlockMiddleware('registration'),
    loginUsersValidation,
    emailUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
        const userEmail = await usersService.findUserByEmail(req.body.email)
        const userLogin = await usersService.findUserByLogin(req.body.login)
        if (userEmail) {
            return res.status(400).send({errorsMessages: [{ message: "user does exist", field: "email" }]})
        }
        if (userLogin) {
            return res.status(400).send({errorsMessages: [{ message: "user does exist", field: "login" }]})
        }

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
        if(user && user.emailConfirmation.isConfirmed) {
            return res.status(400).send({ errorsMessages: [{ message: "user confirmed now", field: "email" }] })
        }
        if (!user) {
            return res.status(400).send({ errorsMessages: [{ message: "email does not exist", field: "email" }] })
        } else {
            await usersService.createNewConfirmCode(user)
            return res.sendStatus(204)
        }
    })

authRouter.post('/refresh-token',
    jwtRefreshAuthMiddleware,
    async (req: Request, res: Response) => {
        await jwtService.expireRefreshToken(req.cookies.refreshToken)
        const accessToken = await authService.createToken(req.user!.accountData.userName)
        const refreshToken = await authService.createRefreshToken(req.user!.accountData.userName)

        if (accessToken === null || refreshToken === null) {
            return res.sendStatus(400)
        } else {
            return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send(accessToken)
        }
    })

authRouter.post('/logout',
    jwtRefreshAuthMiddleware,
    async (req: Request, res: Response) => {
        await jwtService.expireRefreshToken(req.cookies.refreshToken)
        return res.sendStatus(204)
    })

authRouter.get('/me',
    jwtAuthMiddleware,
    async (req: Request, res: Response) => {
        const user = {
            email: req.user!.accountData.email,
            login: req.user!.accountData.userName,
            userId: req.user!._id
        }
        res.status(200).send(user)
    })
