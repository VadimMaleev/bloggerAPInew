import {Request, Response, Router} from "express";
import {loginUsersValidation, passwordUsersValidation} from "../middlewares/users-validation-middleware";
import {errorsMiddleware} from "../middlewares/errors-validation-middleware";
import {authService} from "../domain/auth-service";
import {authMiddleware} from "../middlewares/authorization-middware";

export const authRouter = Router({})

authRouter.post("/login",
    loginUsersValidation,
    passwordUsersValidation,
    errorsMiddleware,
    authMiddleware,
    async (req: Request, res: Response) => {
    const checkResult = await authService.checkCredential(req.body.login, req.body.password)
    })