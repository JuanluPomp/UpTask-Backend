import bcrypt from 'bcrypt'

export async function hashPassword(password: string){
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export const checkPassword = async (enteredPasword: string, hashedPassword: string)=> {
    return await bcrypt.compare(enteredPasword, hashedPassword)
}