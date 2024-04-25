import { ZodError, z } from "zod";
import { User } from "../utils/types";

class UserHelper{

    emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    userSchema= z.object({
        email:
        z.string({
            invalid_type_error: "E-mail invalido.",
            required_error: "E-mail invalido.",

        }).email({
            message:"E-mail invalido."
        }).refine(value => this.emailRegex.test(value), {
            message: 'Dirección de correo electrónico no válida',
        }),

        contrasenia:
        z.string({
            invalid_type_error: "Contraseña invalida.",
            required_error: "Contraseña invalida.",
        }).min(8).max(15).trim()
    })

    public verifyUserEntry = (entry: any): { success: true; data: User } | { success: false; error: ZodError} => { return this.userSchema.safeParse(entry);};

    public verifyId = (id: any):boolean => {return !isNaN(id) && id > 0 && id < 100000000}

}

export default UserHelper;