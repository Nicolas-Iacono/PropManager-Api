import PropiedadModel from '../models/Propiedad'
import { Propiedad} from '../utils/types';


class PropController{

    public getAll = async (): Promise<any>  => {
        try {
            const props = await PropiedadModel.findAll();
            return props;

        } catch (error) {
            return null;
        }
    };

    public findById = async (id:string): Promise<any> =>{
        try {
            const prop = await PropiedadModel.findByPk(id);
           
            return prop? prop.dataValues : undefined;

        } catch (error) {
            return error;
        }
    }

    public create = async (body:Propiedad): Promise<any>=>{
        const verifyId= await this.findById(body.codigo_catastral.toUpperCase());
            //si no encuentra una propiedad con id devuelve undefined
       
        if(verifyId){
            return verifyId.codigo_catastral;
        }
        
        try {
            const parseNewProp= this.parseProp(body);

            const newProp= await PropiedadModel.create({
                codigo_catastral: parseNewProp.codigo_catastral,
                direc_calle: parseNewProp.direc_calle,
                direc_numero: parseNewProp.direc_numero,
                direc_piso:parseNewProp.direc_piso,
                direc_puerta:parseNewProp.direc_puerta,
                dni_propietario:parseNewProp.dni_propietario
            });

            return newProp?newProp.dataValues:null;
                
        } catch (error) {
            return error;
        }

    }

    public update = async (id:string, data:Propiedad): Promise<any> =>{
        const verifyId= await this.findById(id);
            //si no encuentra una propiedad con id devuelve undefined
       
        if(!verifyId){
            return verifyId;
        }
        
        try {
            const updateProp = this.parseProp(data);

            const qery= await PropiedadModel.update(updateProp, {where:{codigo_catastral: id}});
            
            if(qery){
                return updateProp;
            }else{
                return null;
            }
            
        } catch (error) {
            return error;
        }
    }

    public delete = async(id:string):Promise<any> =>{
        const verifyId= await this.findById(id);
            
        if(!verifyId){
            return verifyId;
        }

        try {
            const qery = await PropiedadModel.destroy({where: {codigo_catastral: id}});
            if(qery > 0){
                return {...verifyId};
            }else{
                return null;
            }
        } catch (error) {
            return error;
        }


    }
    
    public findAllByDNI= async (value:number):Promise<any> =>{
        try {
            const qery = await PropiedadModel.findAll({where: {dni_propietario:value}});
            const props= qery.map((prop: any)=>{
                return prop.dataValues    
            })
        
            return props.length > 0 ? props : [];

        } catch (error) {
            return error;
        }
    }

    private parseProp = (params:Propiedad): Propiedad =>{
        const updateProp = {
            codigo_catastral: params.codigo_catastral.toUpperCase(),
            direc_calle: params.direc_calle.toString().toLowerCase().trim(),
            direc_numero: params.direc_numero,
            direc_piso: params.direc_piso? params.direc_piso.toString().toLowerCase().trim() : null ,
            direc_puerta: params.direc_puerta? params.direc_puerta.toString().toLowerCase().trim(): null,
            dni_propietario: params.dni_propietario
        }

        return updateProp;
    }
    
}

export default PropController;
