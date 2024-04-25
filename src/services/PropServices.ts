import { Request, Response} from 'express';
import PropController from '../controllers/PropController';
import PropHelper from '../helpers/PropHelper';

class PropServices{
    private controller: PropController;
    private helper: PropHelper;
    
    constructor(){
        this.controller=new PropController();
        this.helper=new PropHelper();
       
    
    }

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        //hacer paginacion
        try {
            const props = await this.controller.getAll();
            
            props?res.json(props):res.status(500);
    
        } catch (error) {
            res.status(500);

        }
    };

    public findById = async (req:Request, res:Response): Promise<void> =>{
        const reqId=req.params.id.toUpperCase().trim().toString();

        const value= parseInt(req.params.id.substring(2));
        const verifyQery= req.params.id[0] === '?' && req.params.id[1] === '=';
        const verifyNumberDNIQery = value.toString().length >= 7 && value.toString().length <= 8 && !isNaN(value) && verifyQery ;
      
        
        if(verifyNumberDNIQery){
            return this.findAllByDNI(res,value);
        }


        if(!this.helper.isId(reqId)){
            res.status(404).json({error: "Ruta no encontrada."});
            return;
        }
        
        try {
            const prop= await this.controller.findById(reqId);
           
            if(prop){
                res.status(200).json({propiedad:{...prop}});
                
            }else{
                res.status(404).json( {message: "No hay resultados para la busqueda."});
                
            }
            
            
        } catch (error) {
           res.status(500);
        }
        
    }

    public findAllByDNI= async(res:Response, dni:number):Promise<void> =>{
        try {
            const qery= await this.controller.findAllByDNI(dni);
            
            res.status(200).json({propiedades:qery});
            
        } catch (error) {
            res.status(500).json({message: "Internal server error."});
        }
        
    }
    

    public create = async (req:Request, res:Response): Promise<void> =>{
        const cleanData = this.helper.verifyEntryProp(req.body);
       
        if(!cleanData.success){
            res.status(404).json({error: cleanData.error});
            return;
        }

        try {
            const newProp= await this.controller.create(cleanData.data);
            
            if(newProp === cleanData.data.codigo_catastral.toUpperCase()){
                res.status(409).json({message: `La propiedad con codigo ${newProp} ya existe.`});
                return;
            }
            
            if(!newProp){
                res.status(500).json({error: "No se pudo crear la propiedad."});
                return
            }
            res.status(201).json({propiedad: {...newProp}});
            
        } catch (error) {
            res.status(500);
        }
        
    }

    public update = async (req:Request, res:Response): Promise<void> =>{
        const cleanId= req.params.id.toUpperCase().trim().toString();
        const body = req.body;
        const cleanData = this.helper.verifyEntryProp(body);

        if(!cleanData.success ){
            if(!this.helper.isId(cleanId)){
                res.status(404).json({error: "Propiedad invalida."});
            }else{
                res.status(404).json({error: cleanData.error});
            }
            return;
        }

      
        try {
            const updateProp= await this.controller.update(cleanId, cleanData.data);

            if(!updateProp){
                if(updateProp === null){
                    res.status(500).json({error: "Fallo al actualizar cambios."});
                    return;
                }else{  
                    res.status(404).json({error: `No se encontro propiedad ${cleanId}`});
                    return;
                }
            }
            res.status(200).json({propiedad: {...updateProp}});
            
        } catch (error) {
            res.status(500);
        }
    }

    public delete = async (req:Request, res:Response):Promise<void> =>{
        const cleanId= req.params.id.toUpperCase().trim().toString();
       
        if(!this.helper.isId(cleanId)){
            res.status(404).json({error: "Propiedad invalida."});
            return;
        }

        try {
            const deleteProp= await this.controller.delete(cleanId);
            
            if(!deleteProp){
                if(deleteProp === null){
                    res.status(500).json({error: "Fallo al eliminar propiedad."});
                    return;
                }
                res.status(404).json({error: `No hay propiedad con codigo ${cleanId}`});
                return;
            }

            res.status(200).json({propiedad:{...deleteProp}});
            
        } catch (error) {
            res.status(500);
        }
    
    }

}


export default PropServices;








