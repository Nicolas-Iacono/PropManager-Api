import { DataTypes, Model } from "sequelize";
import sequelize from '../database/connection';
import Usuario from "./Usuario";

class Inquilino extends Model {} 

Inquilino.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    dni: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { len: [7, 10] } //9.000.000 o 9000000
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { len: [3, 20] }
    },
    apellido: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { len: [3, 20] }
    },
    telefono: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    // modelName: 'inquilinos'
    freezeTableName: true,
    tableName: 'inquilinos',
    // createdAt:false,
    timestamps:false //si comentaba esta linea, no me traia ningun valor
}).addHook('afterSync','insertInitialValues',async()=>{
    const count = await Inquilino.count();
    if (count === 0) {
        await Inquilino.bulkCreate([
            {id_usuario:2,dni:37245783,nombre:'juan', apellido:'ortega',telefono:1122501309}
        ]);
    }
    
    
})


Usuario.hasOne(Inquilino,{
    foreignKey:'id_usuario'
})

export default Inquilino;