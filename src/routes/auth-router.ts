import {Request, Response, Router} from "express";
import {loginUsersValidation, passwordUsersValidation} from "../middlewares/users-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authService} from "../domain/auth-service";
import {loginAndPassAuthMiddleware} from "../middlewares/login-and-pass-auth-middleware";

export const authRouter = Router({})

authRouter.post("/login",
    loginAndPassAuthMiddleware,
    loginUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    async (req: Request, res: Response) => {
    const token = await authService.createToken(req.body.login)
    res.status(200).send(token)
    })