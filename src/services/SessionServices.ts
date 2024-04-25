import {Request,Response} from "express";
import SessionController from "../controllers/SessionController";
import UserHelper from "../helpers/UserHelper";


class SessionServices{
    private controller:SessionController;
    private helper:UserHelper;


    constructor(){
        this.controller=new SessionController();
        this.helper= new UserHelper();

    }

    public verifyUser= async (req:Request, res:Response): Promise<void>=>{

        const cleanData = this.helper.verifyUserEntry(req.body);

        if(!cleanData.success){
            res.status(404).json({error: cleanData.error});
            return;
        }

        try {
            const info= await this.controller.validateUser(cleanData.data);
    
            if(info){
               res.status(200).json({message: `Bienvenido`, usuario:{info}});
               return
            }
            
            res.status(404).json({error: "Email o contraseña incorrectos."})
            
        } catch (error) {
            res.status(500).json({error: "Internal server error."})
        }

    }
}

export default SessionServices;

