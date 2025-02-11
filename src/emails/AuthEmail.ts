import { transporter } from "../config/nodemailer"

interface IUser{
    email: string,
    name: string,
    token: string
}
export class AuthEmail {
    static sendComfirmationEmails = async (user: IUser  ) => {
        await transporter.sendMail({
            from: 'UpTask@gmail.com',
            to: user.email,
            subject: 'UpTask - Comfirma tu cuenta',
            text:  'UpTask - Comfirma tu cuenta',
            html: `<p>Hola ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes comfirmar tu cuenta</p>
                <p>Visita el siguiente enlace</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Comfirmar cuenta</a>
                <p>Ingresa el siguiente codigo: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })
    }
    static sendPasswordResetToken = async (user: IUser  ) => {
        await transporter.sendMail({
            from: 'UpTask@gmail.com',
            to: user.email,
            subject: 'Reestablece tu password',
            text:  'Reestablece tu password',
            html: `<p>Hola ${user.name}, has solicitado reestablecer tu password</p>
                <p>Visita el siguiente enlace</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>Ingresa el siguiente codigo: <b>${user.token}</b></p>
                <p>Este token expira en 15 minutos</p>
            `
        })
    }
}