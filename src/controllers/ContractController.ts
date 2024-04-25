import ContratoModel from '../models/Contrato';
import ServiciosModel from '../models/servicio_de_contrato';
import Claim from '../models/modelClaims';
import { ContratoAlquilerEntry, UserRequest } from '../utils/types';
import { Role} from '../utils/types';
import Propiedad from '../models/Propiedad';

class ContractController {

    public getAll =async (user:UserRequest): Promise<any>=>{
        try {
            let contracts=[];
            if(user.rol === Role.ADMIN){
                contracts= await ContratoModel.findAll();
                contracts = contracts.map((c) =>{return{...c.dataValues}});
                contracts = await this.completeWithProps(contracts);

            }else{
                contracts= await ContratoModel.findAll({where: {id_inquilino:user.id_usuario}});
                contracts = contracts.map((c) =>{return{...c.dataValues}});
                contracts = await this.completeWithServices(contracts);
                
            }
            contracts = this.updateState(contracts);
            contracts = await this.completeWithClaims(contracts);
            
            return contracts?contracts:[];

        } catch (error) {
            return null;
        }
    }

    private completeWithProps = async (arrContracts:Array<any>): Promise <any> =>{
        try {
            for (let i = 0 ; i < arrContracts.length; i++) {
                let prop = await Propiedad.findOne({where: {codigo_catastral:arrContracts[i].codigo_catastral_prop}});
                arrContracts[i] = {...arrContracts[i], info_propiedad: prop};
            }
            return arrContracts;
            
        } catch (error) {
            return null;
        }
    }

    private completeWithClaims = async (arrContracts:Array<any>): Promise<any> => {
        try {
            for (let i = 0 ; i < arrContracts.length; i++) {
                let quejas = await Claim.findAll({where: {id_contrato:arrContracts[i].id_contrato}});
                arrContracts[i] = {...arrContracts[i], quejas: quejas};
            }
            return arrContracts;
        } catch (error) {
            return null;
        }
    }

    private  completeWithServices = async (arrContracts:Array<any>): Promise<any> => {
        try {
            for (let i = 0 ; i < arrContracts.length; i++) {
                arrContracts[i] = {...arrContracts[i], servicios: await this.getAllServices(arrContracts[i].id_contrato)};
            }
            return arrContracts;
        } catch (error) {
            return null;
        }
        
    }

    private updateState =(contracts:Array<any>): Array<any> =>{
        const today = new Date();
            
        const contractsAlq: Array<any> = contracts.map((c: any) => {
            const finishContract = new Date(c.fecha_inicio);
           
            finishContract.setMonth(finishContract.getMonth() + c.duracion_en_meses);
         
            return {
                id_contrato: c.id_contrato,
                id_usuario:c.id_usuario,
                id_inmobiliaria:c.id_inmobiliaria,
                codigo_catastral_prop:c.codigo_catastral_prop,
                fecha_inicio: new Date(c.fecha_inicio),
                duracion_en_meses: c.duracion_en_meses,
                contrato_digital:c.contrato_digital,
                total_mensual_pesos:c.total_mensual_pesos,
                estado_contrato: finishContract < today, // Compara la fecha de finalización del contrato con la fecha actual
                margen_aumento_trimestral:c.margen_aumento_trimestral,
                ...c
            };
        });
    
        return contractsAlq;
    }

    public findById = async (user:UserRequest, idContract:number): Promise<any>=>{
        try {
            let contract;
            let services;
            let claims;
            let contractDetail;

            if(user.rol == Role.ADMIN){
                let prop;
                contract= await ContratoModel.findByPk(idContract);
                if(!contract){
                    return null;
                }
                prop= await this.getProp(contract.dataValues.codigo_catastral_prop);
                contract={...contract.dataValues,info_propiedad:prop}
                
            }else{
                contract= await ContratoModel.findOne({where: {id_inquilino:user.id_usuario, id_contrato:idContract}}); 
                if(!contract){
                    return null;
                }
                contract= {...contract.dataValues};
            }
            
            contract= this.updateState([contract]);
            contract= {...contract[0]};

            services= await this.getAllServices(idContract);
            claims = await this.getClaims(idContract);
            contractDetail={...contract,servicios:services,quejas: claims};
  
            return contractDetail;
            
        } catch (error) {
            return null;
        }

    }

    private getProp = async (codigo_catastral:string): Promise<any> =>{
        try {
            const prop = Propiedad.findByPk(codigo_catastral);
            return prop;
        } catch (error) {
            return null;
        }
    }

    private getClaims = async (id_contract:number):Promise<any> =>{
        try {
            let claims =await Claim.findAll({where:{id_contrato: id_contract}});
            return claims;
            
        } catch (error) {
            return null;
        }

    }
    
    public create = async (data:ContratoAlquilerEntry): Promise<any>=>{
        const estadoContrato= new Date(data.fecha_inicio) < new Date()? 1:0;
        
        try {
            const newContract = await ContratoModel.create({
                id_usuario:data.id_usuario,
                id_inmobiliaria: data.id_inmobiliaria,
                codigo_catastral_prop: data.codigo_catastral_prop.trim().toUpperCase(),
                fecha_inicio:data.fecha_inicio,
                duracion_en_meses:data.duracion_en_meses,
                contrato_digital:data.contrato_digital?data.contrato_digital:null,
                total_mensual_pesos:data.total_mensual_pesos,
                estado_contrato: estadoContrato,
                margen_aumento_trimestral:data.margen_aumento_trimestral
            })

            return newContract?newContract.dataValues:null;
            
        } catch (error) {
            return error;
        }

    }

    public update = async (data:ContratoAlquilerEntry,id:number): Promise<any>=>{
        try {
            const contract= this.parseContract(data);
            const updContract= await ContratoModel.update(contract, {where:{id_contrato: id}});

            if(updContract){
                return contract;
            }else{
                return null;
            }
            
        } catch (error) {
            return error;
        }
    }

    public delete = async (id:number): Promise<any>=>{
        const contract = await this.findById({rol:Role.ADMIN,id_usuario:1},id);
        if(!contract){
            return undefined;
        }
        try {
            const qery = await ContratoModel.destroy({where: {id_contrato: id}});
            if(qery > 0){
                return {...contract};
            }else{
                return null;
            }
            
        } catch (error) {
            return error;
        }
    }

    public getAllServices = async (idContr:number): Promise<any>=>{
            try {
                const services = await ServiciosModel.findAll({where:{id_contrato: idContr}});
                
                return services? services: [];
            } catch (error) {
                return error;
            }
    }
    
    private parseContract = (params:ContratoAlquilerEntry): ContratoAlquilerEntry =>{
        const estadoContrato= new Date(params.fecha_inicio) < new Date()? 1:0;
        const updateContract={
            id_usuario:params.id_usuario,
            id_inmobiliaria:params.id_inmobiliaria,
            codigo_catastral_prop:params.codigo_catastral_prop.trim().toUpperCase(),
            fecha_inicio: params.fecha_inicio,
            duracion_en_meses:params.duracion_en_meses,
            contrato_digital:params.contrato_digital?params.contrato_digital:null,
            total_mensual_pesos:params.total_mensual_pesos,
            estado_contrato:estadoContrato,
            margen_aumento_trimestral:params.margen_aumento_trimestral
        }

        return updateContract;
    }

}

export default ContractController;