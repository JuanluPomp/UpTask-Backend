import type { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { transporter } from "../config/nodemailer"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController{
    static createAccount = async (req: Request, res:Response) => {
        try {

            const {password, email} = req.body
            
            //revusar si usuario ua existe
            const userExist = await User.findOne({email})
            if(userExist){
                const error = new Error('El usuario ya existe')
                res.status(409).json({error: error.message})
                return
            }

            //Crear usuario
            const user = new User(req.body)

            //Hash password
            user.password = await hashPassword(password)

            //generar el tokken 
            const token =  new Token()
            token.token = generateToken()
            token.user = user.id

            //enviando email
            AuthEmail.sendComfirmationEmails({
                email: user.email,
                name: user.name,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save() ])
            res.send('Cuenta creada, revisa tu email')
        } catch (error) {
            res.status(500).json({error: 'hubo un error'})
        }
    }

}