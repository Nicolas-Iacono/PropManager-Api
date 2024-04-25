import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection';




class Usuario extends Model{};

Usuario.init({
    id_usuario:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    contrasenia:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rol:{
        type:DataTypes.CHAR,
        allowNull:false
    }
},{
    sequelize,
    freezeTableName: true,
    createdAt:false,
    timestamps:false,
    tableName:'usuario'
    
}).addHook('afterSync','insertInitialValues',async()=>{
    const count = await Usuario.count();
    if(count==0){
        await Usuario.bulkCreate([
            {id_usuario:1,email:'admin-manager@gmail.com',contrasenia:'$2b$10$6jFy7TudcIIA3ixoR/ZqKuKECPJduAwfP0vviBGSMThZBJpc2lOei',rol:'a'},
            {id_usuario:2,email:'emailprueba@gmail.com',contrasenia:'$2b$10$uSNzR6XvosENseQV7U9nhOEJ6FqeIy6LMm8x2ckpDG1/KHprhrxZi',rol:'b'}
        ]);
    }
})


export default Usuario;