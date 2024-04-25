import ServicioDeContratoModel from "../models/servicio_de_contrato";
import { ServiciosAsocEntry } from "../utils/types";
class ServiceAsocController{


    public create = async(service:ServiciosAsocEntry): Promise<any> =>{
        const fechaEmision= new Date(service.fecha_emision);
        try {
            const newService= await ServicioDeContratoModel.create({
                id_contrato:service.id_contrato,
                tipo_servicio:service.tipo_servicio.toUpperCase(),
                total_mensual_pesos:service.total_mensual_pesos,
                detalle: service.detalle?service.detalle : null,
                fecha_emision:fechaEmision,
                estado_pago:service.estado_pago
            });

            return newService?newService.dataValues:null;

        } catch (error) {
            return null;
        }
    }

    public update = async (service:ServiciosAsocEntry,id:number):Promise<any> =>{
        try {
            const parseService= this.parseService(service);
            const upService= await ServicioDeContratoModel.update(parseService, {where:{id_serv_mensual:id}});

            if(upService){
                return parseService;
            }else{
                return null;
            }
            
        } catch (error) {
            return null;
        }
    }

    public delete = async (id:number): Promise<any> =>{
        const service= await this.findById(id);

        if(!service){
            return null;
        }
        try {
            const qery = await ServicioDeContratoModel.destroy({where: {id_serv_mensual: id}});
            if(qery > 0){
                return {...service};
            }else{
                return null;
            }
            
        } catch (error) {
            return null;
        }
    }

    public findById = async (id:number): Promise<any> =>{
        try {
            const service = await ServicioDeContratoModel.findByPk(id);
            return service? service.dataValues: undefined;
            
        } catch (error) {
            return null;
        }
    }

    private parseService = (service:ServiciosAsocEntry):ServiciosAsocEntry => {

        return{
            id_contrato:service.id_contrato,
            tipo_servicio:service.tipo_servicio.toUpperCase(),
            total_mensual_pesos:service.total_mensual_pesos,
            detalle: service.detalle? service.detalle.toLowerCase(): null,
            fecha_emision:new Date(service.fecha_emision),
            estado_pago:service.estado_pago
        }
    }

    
}

export default ServiceAsocController;