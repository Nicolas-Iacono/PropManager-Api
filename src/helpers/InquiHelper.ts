import { ZodError, z } from "zod";
import { Inquilino } from "../utils/types";

class InquiHelper{

    userSchema= z.object({
        nombre:
        z.string({
            invalid_type_error: `El nombre debe contener como máximo 200 caracteres.`,
            required_error: `Nombre inválida, superó el máximo de caracteres permitido.`
        })
        .min(3,{message:`El nombre debe contener como mínimo 3 caracteres.`})                      
        .max(500,{message:`El nombre no debe superar los 200 caracteres`})
        .trim()
        .regex(/^[a-zA-Z\s]+$/, {message: "El nombre debe contener entre 3 y 500 caracteres"}),
        
        apellido:
        z.string({
            invalid_type_error: `El apellido debe contener como máximo 200 caracteres.`,
            required_error: `Apellido inválida, superó el máximo de caracteres permitido.`
        })
        .min(3,{message:`El apellido debe contener como mínimo 3 caracteres.`})                      
        .max(500,{message:`El apellido no debe superar los 200 caracteres`})
        .trim()
        .regex(/^[a-zA-Z\s]+$/, {message: "El apellido debe contener entre 3 y 500 caracteres"}),
        
        dni:
        z.number({
            invalid_type_error: "Debe ingresar el DNI del Inquilino.",
            required_error: "DNI invalido.",
        })
        .min(1000000,{message:"DNI invalido."} )
        .max(999999999,{message:"DNI invalido."}),

        telefono:
        z.number({
            invalid_type_error: "Debe ingresar el telefono del Inquilino.",
            required_error: "Telefono invalido.",
        })
        .min(10000000,{message:"Telefono invalido."} )
        .max(9999999999999,{message:"Telefono invalido."}).nullable(), //debería ser mejor un string

    })

    public verifyInquiEntry = (entry: any): { success: true; data: Inquilino } | { success: false; error: ZodError} => { return this.userSchema.safeParse(entry);};

}

export default InquiHelper;