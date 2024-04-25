import { Request, Response } from "express";
import ServicesAsocHelper from "../helpers/ServicesAsocHelper";
import ServiceAsocController from "../controllers/ServiceAsocController";

class ServiceAsocServices{

    private helper:ServicesAsocHelper;
    private controller:ServiceAsocController;

    constructor(){
        this.helper=new ServicesAsocHelper();
        this.controller=new ServiceAsocController();
    }
 
    public create = async (req:Request, res:Response):Promise<void> =>{
        const {userId, userRol, ...newService} = req.body;
        const cleanData= this.helper.verifyEntryService(newService);

        
        
        if(!cleanData.success){
            res.status(404).json({error: cleanData.error});
            return;
        }

        try {
            const service= await this.controller.create(cleanData.data);
            if(!service){
                res.status(500).json({error: "Fallo al agregar servicio."});
                return;
            }
            res.status(201).json({servicio:{...service}});

        } catch (error) {
            res.status(500).json({error:error});
        }

    }

    public update = async (req:Request,res:Response):Promise<void> =>{
        const {userId, userRol, ...upService} = req.body;
        const cleanData= this.helper.verifyEntryService(upService);
        const idServ= parseInt(req.params.id);

        if(isNaN(idServ)){
            res.status(404).json({error: "Servicio invalido."});
            return;
        }
        
        if(!cleanData.success){
            res.status(404).json({error: cleanData.error});
            return;
        }

        try {
            const upService= await this.controller.update(cleanData.data,idServ);
            
            if(!upService){
                res.status(500).json({error:"Fallo al realizar cambios."});
                return;
            }

            res.status(200).json({servicio:{...upService}});

        } catch (error) {
            res.status(500).json({error:error});
        }

    }
    public delete = async (req:Request,res:Response):Promise<void> =>{
        const idServ= parseInt(req.params.id);

        if(isNaN(idServ)){
            res.status(404).json({error: "Servicio invalido."});
            return;
        }

        try {
            const delService= await this.controller.delete(idServ);

            if(delService === undefined){
                res.status(404).json({error:"Servicio no encontrado."});
                return;
            }
            if(delService === null){
                res.status(500).json({error:"Fallo al eliminar servicio."});
                return;
            }
            res.status(200).json({servicio:{...delService}})
            
        } catch (error) {
            res.status(500).json({error:error});
        }
        

    }


}
export default ServiceAsocServices;
