import { SensitiveUser } from "../utils/types";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


class TokensHelper{

    constructor(){
        dotenv.config();
    }

    public signToken= async(user:SensitiveUser): Promise<any> =>{
        const secret= process.env.JWT_SECRET;
        
        return jwt.sign(
            {
                _id: user.id_usuario,
                rol:user.rol
            },
            secret?secret:"nocountry2024",
            {
                expiresIn: "8h",
            }

        )
    }

    public verifyToken = async (token:string): Promise<any>=>{
        try {
            return jwt.verify(token,process.env.JWT_SECRET?process.env.JWT_SECRET:"nocountry2024");
        } catch (error) {
            return null;
        }
    }

}

export default TokensHelper;