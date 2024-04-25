import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';
import Contrato from './Contrato';
import rubro_servicio from './Rubro';

class Servicio_de_contrato extends Model{};

Servicio_de_contrato.init({
    id_serv_mensual:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    id_contrato:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    tipo_servicio:{
        type:DataTypes.STRING(200),
        allowNull:false,
    },
    total_mensual_pesos:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    detalle:{
        type:DataTypes.STRING(300),
        allowNull:true,
    },
    fecha_emision:{
        type:DataTypes.DATE,
        allowNull:false,
    },

    estado_pago:{
        type:DataTypes.INTEGER,
        allowNull:false,
        values:['0','1','2','-1']   //0 que esta situacion normal, 1 cerca de fecha vencimiento, 2 pago, -1 vencida/nunca se pago
    }

},{
    sequelize,
    freezeTableName: true,
    createdAt:false,
    timestamps:false,
    tableName:'servicio_de_contrato'
})


Contrato.hasOne(Servicio_de_contrato,{
    foreignKey:"id_contrato",
})

Servicio_de_contrato.belongsTo(rubro_servicio,{
    foreignKey:"tipo_servicio"
})



export default Servicio_de_contrato;