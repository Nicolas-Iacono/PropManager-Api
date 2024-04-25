import sequelize from "./connection";
import Inquilino from "../models/modelInquilino";
import Inmobiliaria from "../models/Inmobiliaria";

export const dbInit = ()=>{
    const {Usuario, Contrato, Propiedad, Rubro_servicio, Servicio_de_contrato, Claim} = sequelize.models;
    
    Usuario.sync();
    Propiedad.sync();
    Contrato.sync();
    Rubro_servicio.sync();
    Servicio_de_contrato.sync();
    Inquilino.sync();
    Claim.sync(); 
    Inmobiliaria.sync();
}