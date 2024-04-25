import { ZodError, z } from "zod";
import { ServiciosAsocEntry } from "../utils/types";

class ServicesAsocHelper{

    serviceSchema=z.object({
        id_contrato:
        z.number({
            invalid_type_error: `Id de contrato invalido.`,
            required_error: `Id de contrato invalido.`,
        }),

        tipo_servicio:
        z.string({
            invalid_type_error: `Tipo de servicio invalido.`,
            required_error: `Tipo de servicio invalido.`,
        })
        .max(200).trim(),

        total_mensual_pesos:
        z.number({
            invalid_type_error: `Id de contrato invalido.`,
            required_error: `Id de contrato invalido.`,
        }),

        detalle:
        z.string({
            invalid_type_error: `Detalle invalido.`,
            required_error: `Detalle invalido.`,
        })
        .max(300).trim().nullable(),

        fecha_emision: 
        z.date().min(new Date("1900-01-01"), {message:`Fecha emision invalida.`}),
        
        estado_pago:
        z.number({
            invalid_type_error: `Id de contrato invalido.`,
            required_error: `Id de contrato invalido.`,
        }).max(2).min(-1)
           
    });

    public verifyEntryService = (entry: any): { success: true; data: ServiciosAsocEntry } | { success: false; error: ZodError} => { 
        entry.fecha_emision=new Date (entry.fecha_emision);
        return this.serviceSchema.safeParse(entry);};

}

export default ServicesAsocHelper;