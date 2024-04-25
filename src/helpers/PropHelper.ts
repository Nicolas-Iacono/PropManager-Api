import {  ZodError, z } from "zod";
import { Propiedad } from "../utils/types";


class PropHelper{
    
    propSchema= z.object({

        codigo_catastral: 
        z.string({
            invalid_type_error: "El codigo debe contener numeros y/o letras.",
            required_error: "Codigo catastral invalido. Verifique existencia de una propiedad con el codigo o ingrese uno valido.",

        })
        .min(3, {message:"El codigo debe tener mas de 3 caracteres."}) 
        .max(100,{message: "El codigo no puede contener mas de 100 caracteres."})
        .trim()
        .regex(/^[a-zA-Z0-9]+$/, { 
            message: "El codigo debe contener solo letras y/o numeros sin espacios."
        }),     

        direc_calle:
        z.union([z.string()
            .max(250,{message: "Nombre de calle demasiado largo."})
            .min(3,{message:"Nombre de calle demasiado corto."})
            .trim()
            .regex(/^[a-zA-Z0-9\s.]+$/, {
                message: "La calle de la dirección debe contener solo nombres de calles."
            }),
        z.number()
            .min(0)
            .max(99999,{message:"Nombre de calle invalido."})],
        {invalid_type_error:"Ingrese un nombre de calle valido",
        required_error:"Ingrese un nombre de calle"}),

        direc_numero:
        z.number({
            invalid_type_error: "Debe ingresar un numero a la direccion",
            required_error: "Numero de direccion invalido.",
        })
        .min(1,{message:"Numero de direccion invalido."})                      
        .max(99999,{message:"Numero de direccion invalido."}),

        direc_piso:
        z.union([
            z.string().includes("pb" || "PB",{message:"Piso invalido."}).trim().regex(/^[a-zA-Z0-9]+$/, { message: "El codigo debe contener solo letras y/o numeros sin espacios intermedios."}),
            z.number().min(0,{message:"Piso invalido."}).max(95,{message:"Piso invalido."})
        ],
        {invalid_type_error:"Piso invalido."}).nullable(),

        direc_puerta:
        z.union([
            z.string().max(5,{message:"Puerta invalido."}).trim().regex(/^[a-zA-Z0-9]+$/, { message: "El codigo debe contener solo letras y/o numeros sin espacios intermedios."}),
            z.number().min(0,{message:"Puerta invalido."}).max(999999,{message:"Puerta invalido."})
        ],
        {invalid_type_error:"Puerta invalido."}).nullable(),

        dni_propietario:
        z.number({
            invalid_type_error: "Debe ingresar un numero de DNI del propietario.",
            required_error: "Numero de DNI invalido.",
        })
        .min(1000000,{message:"DNI invalido."} )
        .max(999999999,{message:"DNI invalido."}),
    })

    
    public isId=(entry:string): boolean =>{ return entry.length > 0 && entry.length < 100 && entry.trim() !== '';}
        
    public verifyEntryProp = (entry: any): { success: true; data: Propiedad } | { success: false; error: ZodError} => {
        return this.propSchema.safeParse(entry);};

}

export default PropHelper;



  