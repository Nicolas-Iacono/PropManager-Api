import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/connection';
import Usuario from "./Usuario";

class Inmobiliaria extends Model{};
Inmobiliaria.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { len: [3, 20] }
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
    hora_apertura:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    hora_cierre:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    descripcion: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },

},{
    sequelize,
    freezeTableName: true,
    createdAt:false,
    timestamps:false,
    tableName:'inmobiliaria'

}).addHook('afterSync','insertInitialValues',async()=>{
    const count = await Inmobiliaria.count();
    if(count==0){
        await Inmobiliaria.bulkCreate([
            {id_usuario:1,
                nombre:'InmoApp',
                direc_calle:'Manfredini',
                direc_numero:1,
                direc_piso: 0,
                direc_puerta: "5",
                hora_apertura: 8,
                hora_cierre: 14,
                descripcion: "Inmobiliaria/Admin"
            }
        ]);
    }
})

Usuario.hasOne(Inmobiliaria,{
    foreignKey:'id_usuario'
})


export default Inmobiliaria;