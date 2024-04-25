import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/connection';
import Contrato from './Contrato';

class Propiedad extends Model{};
Propiedad.init({
    codigo_catastral:{
        type:DataTypes.STRING(100),
        primaryKey:true,
        allowNull:false,
        validate:{len:[3,100]}
    },
    direc_calle:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    direc_numero:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    direc_piso:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    direc_puerta:{
        type:DataTypes.STRING(10),
        allowNull:true,
        validate:{len:[0,10]}
    },
    dni_propietario:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }

},{
    sequelize,
    freezeTableName: true,
    createdAt:false,
    timestamps:false,
    tableName:'propiedad'

})

Propiedad.hasMany(Contrato,{
    foreignKey: 'codigo_catastral_prop'
})


export default Propiedad;