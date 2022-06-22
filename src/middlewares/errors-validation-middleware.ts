import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const errorsMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const errs = errors.array({onlyFirstError: true}).map((error) => {
            const errorObject = {
                massage:error.msg,
                field: error.param
            }
            return errorObject
        })
        res.status(400).send(
            {
                errorsMassages: errs
            }
        )
        return
    }
    next()
}