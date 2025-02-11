import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
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

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email')
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            //verificar si el token existe
            const {token} = req.body
            const tokenExist = await Token.findOne({token})
            if(!tokenExist){
                const error = new Error('El token no es valido')
                res.status(401).json({error: error.message})
                return
            }
            //Verificar si el usuario existe
            const user = await User.findById(tokenExist.user)
            if(!user){
                const error = new Error('El usuario no existe')
                res.status(409).json({error: error.message})
                return
            }
            //comfirmar usuario y eliminar token vencido
            user.confirmed = true
            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.json('Cuenta comfirmada correctamente')
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            //Comfirmar si usuario existe
            const {email, password} = req.body
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('El usuario no existe')
                res.status(401).json({error: error.message})
                return
            }
            
            //Comfirmar si usuario esta comfirmado
            if(!user.confirmed){
                res.json('usuario no comfirmado, hemos enviado un email de comfirmacion')
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                await  token.save()
                AuthEmail.sendComfirmationEmails({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                return
            }
            //Comfirmar si la contraseña ingresada es correcta
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('La contraseña no es correcta')
                res.status(401).json({error: error.message})
                return
            }
            //login acetatado
            res.send('Iniciando sesion...')
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
    static requestNewConfirmationCode = async (req: Request, res:Response) => {
        try {

            const {password, email} = req.body
            
            //revusar si usuario ua existe
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('El usuario ya existe')
                res.status(409).json({error: error.message})
                return
            }
            if(user.confirmed){
                const error = new Error('El ya esta confirmado')
                res.status(409).json({error: error.message})
                return
            }
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

            await Promise.allSettled([user.save(), token.save()])

            res.send('Te hemos enviado un nuevo token a tu email')
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
    static forgotPassword = async (req: Request, res:Response) => {
        try {

            const {password, email} = req.body
            
            //revusar si usuario ua existe
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('El usuario ya existe')
                res.status(409).json({error: error.message})
                return
            }
            //generar el tokken 
            const token =  new Token()
            token.token = generateToken()
            token.user = user.id
            await  token.save()
            //enviando email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
}