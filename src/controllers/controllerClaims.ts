import Claim from '../models/modelClaims';
import { UserRequest } from '../utils/types';
import { Role} from '../utils/types';

class controllerClaims {
    
    public findAllClaims = async (user: UserRequest): Promise<any> => {
        try {
            let claims;

            if(user.rol === Role.ADMIN){
                claims = await Claim.findAll();
            }else{
                claims = await Claim.findAll({
                    where: {
                        id_usuario:user.id_usuario,
                    }
                });
            }

            return claims;

            
        } catch (error) {
            return null;
        }
    }

    public updateStatusClaim = async(user: UserRequest,id: any, state: any): Promise<any> => {

        try {
            let claim = null;

            if(user.rol === Role.ADMIN){
                claim = await Claim.findOne({
                    where: {
                        id_queja: id
                    }
                });
            }

            console.log(claim);

            if(claim === null){
                return null;
            }
            
            await claim.update({estado: state});
            await claim.save();

            return claim;

        } catch (error) {
            return null;
        }
    }

    public deleteClaim = async(user: UserRequest, id: any): Promise<any> => {

        try {
            let claim = null;

            if(user.rol === Role.ADMIN){
                claim = await Claim.findOne({
                    where: {
                        id_queja: id
                    }
                })
            }
            
            if(claim === null){
                return null;
            }

            await claim.destroy();

            return user;

        } catch (error) {
            return null;
        }

    }

    public createClaim = async(user: UserRequest,body: any): Promise<any> =>
    {
        try {
            let claim = null;

            if(user.rol === Role.BASIC){
                claim = await Claim.create({
                    id_usuario: body.id_usuario,
                    id_contrato: body.id_contrato,
                    descripcion: body.descripcion,
                    estado: body.estado,
                    tipo: body.tipo
                });
            }

            console.log(claim);

            if(claim === null)
            {
                return null;
            }

            return claim;

        } catch (error) {
            return null;
        }
    }

    public findClaim = async (id: any): Promise<any> => {
        try {
            const claim = await Claim.findOne({
                where: {
                    id_queja: id,
                }
            });
    
            return claim;

        } catch (error) {
            return null;
        }
    }

}

export default controllerClaims;