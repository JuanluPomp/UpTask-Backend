import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { body } from "express-validator"
import { handleInputErrors } from "../middleware/validation"

const router = Router()

router.post('/create-account',
    body('name').
        notEmpty().withMessage('El nombre del usuario es obligatorio'),
    body('password').
        isLength({min: 8}).withMessage('La contraseña es obligatoria y debe tener al menos 8 caracteres'),
    body('email').
        isEmail().withMessage('El email no es valido'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').
        notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').
        notEmpty().withMessage('El email es obligatorio'),
    body('password').
        notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.login
)
router.post('/request-code',
    body('email').
        notEmpty().withMessage('El emial es obligatorio'),
    handleInputErrors,
    AuthController.requestNewConfirmationCode
)
router.post('/forgot-password',
    body('email').
        notEmpty().withMessage('El emial es obligatorio'),
    handleInputErrors,
    AuthController.forgotPassword
)

export default router