import { Sequelize } from "sequelize";
import dontenv from "dotenv"


dontenv.config();
const sequelize = new Sequelize(
    process.env.DB_NAME || "railway", 
    process.env.DB_USER ||'root', 
    process.env.DB_PSW || "BbFZUJvSNisEVLEjdVBTMhlZYLbiRUdX",
    {
    host: process.env.DB_HOST || "monorail.proxy.rlwy.net",
    dialect:'mysql'|| process.env.DB_DIALECT ,
    port:  process.env.DB_PORT ? parseInt(process.env.DB_PORT): 14203,
    
});


export const connDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa con la base de datos')
    } catch (error) {
        console.error('No se pudo conectar a la base de datos', error);
    }
}


 
 export default sequelize;