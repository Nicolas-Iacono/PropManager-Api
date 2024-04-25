import {z , ZodError} from 'zod';
import {Claim, stateClaim} from '../utils/types';

class ClaimHelper {

    private arrError = ['Queja', 'Inquilino', 'Contrato', 'descripcion', 'estado', 'tipo', 'invalido']

    claimSchema = z.object(
        {
            id_usuario:
            z.number({
                invalid_type_error: `${this.arrError[1]} ${this.arrError[ this.arrError.length-1 ] }`,
                required_error: `${this.arrError[1]} ${this.arrError[ this.arrError.length-1 ]}`
            })
            .min(0,{message:`${this.arrError[1]} ${this.arrError[this.arrError.length-1]}`})                      
            .max(100000000,{message:`${this.arrError[1]} ${this.arrError[this.arrError.length-1]}`}),

            id_contrato:
            z.number({
                invalid_type_error: `${this.arrError[2]} ${this.arrError[ this.arrError.length-1 ] }`,
                required_error: `${this.arrError[2]} ${this.arrError[ this.arrError.length-1 ]}`
            })
            .min(0,{message:`${this.arrError[2]} ${this.arrError[this.arrError.length-1]}`})                      
            .max(100000000,{message:`${this.arrError[2]} ${this.arrError[this.arrError.length-1]}`}),

            descripcion:
            z.string({
                invalid_type_error: `La descripción debe contener como máximo 500 caracteres.`,
                required_error: `Descripcion inválida, superó el máximo de caracteres permitido.`
            })
            .min(3,{message:`La descripción debe contener como mínimo 3 caracteres. Ej: Luz`})                      
            .max(500,{message:`La descripción no debe superar los 500 caracteres`})
            .trim()
            .regex(/^[0-9a-zA-Z\s]+$/, {message: "La descripcion debe contener entre 3 y 500 caracteres"}),

            estado:
            z.enum(['Pendiente', 'Atendido', 'Completado']),

            tipo: 
            z.enum(['Reparacion', 'Queja'])
        }
    )

    public verifyClaim = (claim: any): {success: true; data: Claim} | {success: false; data: ZodError<any>} =>
    {
        try {
            const isValidClaim = this.claimSchema.parse(claim);
            return {success: true, data: isValidClaim as Claim}
        } catch (error) {
            return {success: false, data: error as ZodError<any>};
        }
    }

    public verifyId = (id: any):boolean => {return !isNaN(id) && id > 0 && id < 100000000}

    public verifyState = (state: string):boolean =>
        {
            const isValidState = Object.values(stateClaim).includes(state as stateClaim)
                
            if(isValidState){
                return true;
            }else{
                return false;
            }
        }
}

export default ClaimHelper;