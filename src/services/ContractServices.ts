import { Request, Response} from 'express';
import ContractController from '../controllers/ContractController';
import ContractHelper from '../helpers/ContractHelper';


class ContractServices{
    private controller:ContractController;
    private helper: ContractHelper;

    constructor(){
        this.controller=new ContractController();
        this.helper=new ContractHelper();
    }

    public getAll = async (req:Request, res:Response):Promise<void> =>{
        const user={id_usuario: req.body.userId, rol: req.body.userRol};
     
        try {
            const contracts=await this.controller.getAll(user);

            contracts?res.status(200).json(contracts):res.status(500);
            
        } catch (error) {
            res.status(500).json({error: error});
        }
        
    }

    public findById = async (req:Request, res:Response):Promise<void> =>{
        const user = {id_usuario:req.body.userId, rol:req.body.userRol};
        const idContract= parseInt(req.params.id.trim());

        if(isNaN(idContract)){
            res.status(404).json({error: "Bad request."});
            return
        }

        try {
            const contractDetail= await this.controller.findById(user,idContract);

            if(!contractDetail){
                res.status(404).json({error:"Bad request."});
                return
            }
            res.status(200).json({contrato:{...contractDetail}});
            
        } catch (error) {
            res.status(500).json({error:error});
            
        }
    }

    public create = async (req:Request, res:Response):Promise<void> =>{
        console.log(req.body);
        req.body.fecha_inicio= new Date(req.body.fecha_inicio);
        
        const {userId, userRol, ...data}=req.body;
        const cleanData= this.helper.verifyEntryContract(data);

        if(!cleanData.success){
            res.status(404).json({error:cleanData.error});
            return;
        }

        try {

            const newContract= await this.controller.create(cleanData.data);

            newContract!==null
            ?res.status(201).json({contrato: {...newContract}})
            :
            res.status(500).json({error:"Error al crear el contrato."})
            
        } catch (error) {
            res.status(500).json({error:error});
        }
        
    }

    public update = async (req:Request, res:Response):Promise<void> =>{
        req.body.fecha_inicio= new Date(req.body.fecha_inicio);
        const {userId, userRol, ...data}=req.body;
        const idContrato=parseInt(req.params.id);
        const cleanData= this.helper.verifyEntryContract(data);

        if(!cleanData.success){
            res.status(404).json({error:cleanData.error});
            return;
        }
        if(isNaN(idContrato)){
            res.status(404).json({error:"Contrato invalido."});
            return;
        }

        try {
            const upContract= await this.controller.update(cleanData.data,idContrato);
            if(upContract == null){
                res.status(500).json({error: "Fallo al actualizar cambios."});
                return;
            }
            res.status(200).json({contrato:{...upContract}});
            
        } catch (error) {
            res.status(500).json({error:error});
        }
    }

    public delete = async (req:Request, res:Response):Promise<void> =>{
        const id = parseInt(req.params.id.trim());
        if(isNaN(id)){
            res.status(404).json({error:"Contrato invalido."});
            return;
        }

        try {
            const delCont= await this.controller.delete(id);
            if(delCont == undefined){
                res.status(404).json({error: "Contrato invalido."});
                return
            }
            if(delCont == null){
                res.status(500).json({error: "Fallo al eliminar contrato."});
                return
            }
            res.status(200).json({contrato:{...delCont}});
        } catch (error) {
            res.status(500).json({error:error});
        }
    }

    public getAllServices = async (req:Request, res:Response):Promise<void> =>{
        const idContract= parseInt(req.params.id);
      
        if(isNaN(idContract)){
            res.status(404).json({error:"Contrato invalido."});
            return;
        }

        try {
             await this.controller.getAllServices(idContract);

        } catch (error) {
            
        }
    }

}

export default ContractServices;