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
            html: `<p>Hola ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes comfirmar tu cuenta</p>`
        })
    }
}