import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';
//import Servicio_de_contrato from './Servicio_de_contrato';


class Rubro_servicio extends Model{};

Rubro_servicio.init({
    tipo_servicio:{
        type:DataTypes.STRING(100),
        primaryKey:true,
        allowNull:false,
    },
    nombre_proveedor:{
        type:DataTypes.STRING(200),
        allowNull:true,
    }
},{
    sequelize,
    freezeTableName:true,
    createdAt:false,
    timestamps:false,
    tableName:'rubro_servicio',

}).addHook('afterSync','insertInitialValues',async()=>{
    const count = await Rubro_servicio.count();
    if(count == 0){
        await Rubro_servicio.bulkCreate([
            {tipo_servicio:'LUZ',nombre_proveedor:'empresa de luz s.a'},
            {tipo_servicio:'GAS',nombre_proveedor:'camuzzi gas pampeana s.a'},
            {tipo_servicio:'INTERNET',nombre_proveedor:'personal s.a'},
            {tipo_servicio:'AGUA',nombre_proveedor:'aysa'},
            {tipo_servicio:'EXPENSAS',nombre_proveedor:null},
            {tipo_servicio:'SEGUROS',nombre_proveedor:null}
        ]);
    }
});

// Rubro_servicio.hasOne(Servicio_de_contrato,{
//     foreignKey:'tipo_servicio'
// })


export default Rubro_servicio;