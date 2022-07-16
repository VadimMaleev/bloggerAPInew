import nodemailer from "nodemailer";
import {UserAccType} from "../repositories/db";

export const emailAdapter = {
    async sendEmailConfirmationCode(newUser: UserAccType) {
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "bloggersauthmail@gmail.com", // generated ethereal user
                pass: "qpjjtxsurfvalhhh", // generated ethereal password
            },
        });

        await transport.sendMail({
            from: '"Bloggers Api" <bloggersauthmail@gmail.com>',
            to: newUser.accountData.email,
            subject: 'Confirm Account',
            html:`<a href='https://somesite.com/confirm-email?code=${newUser.emailConfirmation.confirmationCode}'>Ссылка</a>`
        })
    }
}