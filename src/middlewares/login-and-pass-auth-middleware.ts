import {Request, Response, NextFunction} from "express";
import {authService} from "../domain/auth-service";

export const loginAndPassAuthMiddleware = async (req: Request, res: Response, next: NextFunction
) => {
    const user = await authService.checkCredential(req.body.login)
    if(!user) {
        return res.status(401).send('auth required')
    }
    const password = await authService.checkPassword(req.body.password, user.passwordHash)
    if (!password) {
        return res.status(401).send('auth required')
    }

    next()
}