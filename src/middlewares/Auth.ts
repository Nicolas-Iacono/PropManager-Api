import { Request, Response, NextFunction } from 'express';
import TokensHelper from '../helpers/TokensHelper';
import { Role } from '../utils/types';

class Auth {
    private helper: TokensHelper;

    constructor(){
        this.helper=new TokensHelper();
    }


    public checkToken = async(req:Request,res:Response,next:NextFunction) =>{
        try {
            const token = req.headers.authorization?.split(' ').pop();
            if(!token){
                res.status(401).json({error:"No tienes permisos validos."});
                return;
            }
            const tokenData= await this.helper.verifyToken(token);
            if(!tokenData){
                res.status(401).json({error:"No tienes permisos validos."});
                return;
            }
            if(tokenData._id){
                req.body.userId=tokenData._id;
                req.body.userRol=tokenData.rol;
                next();
            }else{
                res.status(409);
            }
            
        } catch (error) {
            res.status(409);
            
        }
        
    }

    public checkAdminAuth = (req:Request,res:Response,next:NextFunction)=>{
        if(req.body.userRol !== Role.ADMIN){
            res.status(401)
            return res.json({error:"Unauthorized"});
        }
        next();
    }


}

export default Auth;




