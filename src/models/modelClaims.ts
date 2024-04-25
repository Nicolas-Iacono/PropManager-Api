import { DataTypes, Model } from "sequelize";
import sequelize from '../database/connection';
import {stateClaim, typeClaim} from '../utils/types'
import Usuario from "./Usuario";
import Contrato from './Contrato';

//convertir a string el enum
const estadoClaimArray = Object.values(stateClaim) as string[];
const tipoClaimArray = Object.values(typeClaim) as string[];

class Claim extends Model{} 

Claim.init({
    id_queja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_contrato: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM(...estadoClaimArray),
        allowNull: false
    },
    tipo: {
            type: DataTypes.ENUM(...tipoClaimArray),
            allowNull: false
        }
},{
    sequelize,
    // modelName: 'quejas'
    freezeTableName: true,
    tableName: 'quejas',
    // createdAt:false,
    timestamps:false //si comentaba esta linea, no me traia ningun valor
});

Usuario.hasOne(Claim, {
    foreignKey: 'id_usuario'
});

Claim.belongsTo(Contrato, {
    foreignKey: 'id_contrato'
});

export default Claim;