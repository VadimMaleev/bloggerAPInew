import {UserAccType} from "../repositories/db";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserAccType | null
        }
    }
}