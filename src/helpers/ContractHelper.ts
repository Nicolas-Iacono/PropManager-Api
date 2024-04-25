import { ZodError, z } from "zod";
import { ContratoAlquilerEntry } from "../utils/types";


class ContractHelper{

    
    private attInv=['Inquilino',
    'Inmobiliaria', 'Codigo catastral', 
    'Fecha comienzo contrato','Duracion en meses',
    'Contrato digital', 'Total mensual','Margen de aumento','invalido.'];

  
    contractSchema=z.object({
        id_usuario:
        z.number({
            invalid_type_error: `${this.attInv[0]} ${this.attInv[this.attInv.length-1]}`,
            required_error: `${this.attInv[0]} ${this.attInv[this.attInv.length-1]}`,
        })
        .min(0,{message:`${this.attInv[0]} ${this.attInv[this.attInv.length-1]}`})                      
        .max(99999999,{message:`${this.attInv[0]} ${this.attInv[this.attInv.length-1]}`}),  
    
        id_inmobiliaria:
        z.number({
            invalid_type_error: `${this.attInv[1]} ${this.attInv[this.attInv.length-1]}`,
            required_error: `${this.attInv[1]} ${this.attInv[this.attInv.length-1]}`,
        })
        .min(0,{message:`${this.attInv[1]} ${this.attInv[this.attInv.length-1]}`})                      
        .max(9999999,{message:`${this.attInv[1]} ${this.attInv[this.attInv.length-1]}`}),
           
        codigo_catastral_prop:
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
            
        fecha_inicio:
        z.date().min(new Date("1900-01-01"), {message:`${this.attInv[3]} ${this.attInv[this.attInv.length-1]}`}),

        duracion_en_meses:
        z.number({
            invalid_type_error: `${this.attInv[4]} ${this.attInv[this.attInv.length-1]}`,
            required_error: `${this.attInv[4]} ${this.attInv[this.attInv.length-1]}`,
        })
        .min(0,{message:`${this.attInv[4]} ${this.attInv[this.attInv.length-1]}`})
        .max(9999,{message:`${this.attInv[4]} ${this.attInv[this.attInv.length-1]}`}),

        contrato_digital:
        z.string({
            invalid_type_error: `${this.attInv[5]} ${this.attInv[this.attInv.length-1]}`,
            required_error: `${this.attInv[5]} ${this.attInv[this.attInv.length-1]}`,
        }).nullable(),

        total_mensual_pesos:
        z.number({
            invalid_type_error: `${this.attInv[6]} ${this.attInv[this.attInv.length-1]}`,
            required_error: `${this.attInv[6]} ${this.attInv[this.attInv.length-1]}`,
        })
        .min(0,{message:`${this.attInv[6]} ${this.attInv[this.attInv.length-1]}`})
        .max(99999999999,{message:`${this.attInv[6]} ${this.attInv[this.attInv.length-1]}`}),

        margen_aumento_trimestral:
        z.number({
            invalid_type_error: `${this.attInv[7]} ${this.attInv[this.attInv.length-1]}`,
            required_error: `${this.attInv[7]} ${this.attInv[this.attInv.length-1]}`,
        })
        .min(0,{message:`${this.attInv[6]} ${this.attInv[this.attInv.length-1]}`})
        .max(999999999,{message:`${this.attInv[6]} ${this.attInv[this.attInv.length-1]}`}),
    })
    

    public verifyEntryContract = (entry: any): { success: true; data: ContratoAlquilerEntry } | { success: false; error: ZodError} => { return this.contractSchema.safeParse(entry);};

}

export default ContractHelper;