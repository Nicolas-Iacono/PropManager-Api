import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';
import Usuario from './Usuario';

class Contrato extends Model{}

Contrato.init({
    id_contrato:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    id_inquilino:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    id_inmobiliaria:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    codigo_catastral_prop:{
        type:DataTypes.STRING(100),
        allowNull:false,
        validate:{len:[3,100]}
    },
    fecha_inicio:{
        type:DataTypes.DATE,
        allowNull:false
    },
    duracion_en_meses:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    contrato_digital:{
        type:DataTypes.BLOB,
        allowNull:true
    },
    total_mensual_pesos:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    estado_contrato:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    margen_aumento_trimestral:{
        type:DataTypes.DOUBLE,
        allowNull:false
    }
    
},{
    sequelize,
    freezeTableName: true,
    createdAt:false,
    timestamps:false,
    tableName:'contrato'
    
})

Usuario.hasOne(Contrato,{
    foreignKey:"id_inmobiliaria",               
})
Usuario.hasOne(Contrato,{
    foreignKey:"id_inquilino"
})




export default Contrato;