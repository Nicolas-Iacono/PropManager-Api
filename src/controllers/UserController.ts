import Inmobiliaria from '../models/Inmobiliaria';
import Usuario from '../models/Usuario'
import Claim from '../models/modelClaims';
import InquilinoModel from '../models/modelInquilino';
import Contrato from '../models/Contrato';
import * as bcrypt from 'bcrypt';
import { Op } from "sequelize";
import { Role } from '../utils/types';


class UserController {

    public findAll = async(): Promise<any> =>
    {
        try {
            
            let usersData =[];
            let users = await Usuario.findAll(
                {
                    where: {
                        id_usuario: {
                          [Op.not]: 1 // Excluye el usuario 1 que es la inmobiliaria
                        }
                      }
                }
            );
            usersData = users.map((u) =>{return{
                id_usuario: u.dataValues.id_usuario,
                email: u.dataValues.email
            }});
            
            usersData = await this.completeData(usersData);
            usersData= await this.getAllClaims(usersData);
           
            return usersData;

        } catch (error) {
            return null;
        }
    }
    private getAllClaims = async (arrUsers:Array<any>): Promise<any> => {
        try {
            for (let i = 0 ; i < arrUsers.length; i++) {
                let quejas = await Claim.findAll({where: {id_usuario:arrUsers[i].id_usuario}});
                if(quejas.length > 0){
                    quejas = quejas.map((q)=>{return{...q.dataValues}})
                    arrUsers[i] = {...arrUsers[i], quejas: quejas};
                }
                
                
            }
            return arrUsers;
        } catch (error) {
            return null;
        }
    }

    private completeData = async (arrData:Array<any>): Promise<any> =>{
        try {
            for (let i = 0; i < arrData.length; i++) {
                let info= await this.findOneBasic(arrData[i].id_usuario);
                if(info){
                    info= {
                        dni:info.dni,
                        nombre:info.nombre,
                        apellido:info.apellido,
                        telefono:info.telefono
                    }
                    arrData[i]={...arrData[i],...info}
                } 
            }
            
        } catch (error) {
            console.log(error); 
        }
        
        return arrData;
    }

    private findOneBasic = async(id:number): Promise<any> =>{
        try {
            const user = await InquilinoModel.findByPk(id);
            return user?user.dataValues:null;

        } catch (error) {
            return null
            
        }
    }

    public findOne = async(id: any): Promise<any> =>
        {
            try {
                let data;
                let user = await Usuario.findOne({
                    where: {
                        id_usuario: id
                    }
                });
                if(!user){
                    return null; 
                }
                const {id_usuario,contrasenia, ...dataUser}= user.dataValues;
                const rol= user.dataValues.rol;
                //verificamos que usuario se trajo para saber cual mostrar            
                if(rol == Role.ADMIN){
                    const qery = await Inmobiliaria.findOne({
                        where: {
                            id_usuario: id
                        }
                    });
                    if(qery === null){
                        return dataUser;
                    }
                    data= {...qery.dataValues, ...dataUser}
                   
                }else{
                    const qery = await InquilinoModel.findOne({
                        where: {
                            id_usuario: id
                        }
                    });
                
                   if(qery === null){
                       return dataUser;
                    }

                    data ={...qery.dataValues, ...dataUser}
                    data = await this.getAllClaims([data])
                    data={...data[0]};
                }

                return data;
            } catch (error) {
                return null;
            }
        }

        public updateUser = async(id: any, bodyUser: any, body: any): Promise<any> => 
        {
            try {
                
                const user = await Usuario.findOne({
                    where: {
                        id_usuario: id
                    }
                });

                //verificar que tipo de usuario se modifica

                if(user?.dataValues.rol === "a"){
                    
                    const inmo = await Inmobiliaria.findOne({
                        where: {
                            id_usuario: id
                        }
                    });

                    if(user === null || inmo === null)
                    {
                        return null;
                    }

                    const hashPassword=await bcrypt.hash(bodyUser.contrasenia,10);
                    await user.update({
                        email: bodyUser.email,
                        contrasenia: hashPassword
                    })
                    await user.save();
    
                    await inmo.update({
                        nombre: body.nombre,
                        apellido: body.apellido,
                        dni: body.dni,
                        telefono: body.telefono
                    })
                    await inmo.save();

                }else if(user?.dataValues.rol === "b"){

                    const inqui = await InquilinoModel.findOne({
                        where: {
                            id_usuario: id
                        }
                    });

                    if(user === null || inqui === null)
                        {
                            return null;
                        }
                        
                        const hashPassword=await bcrypt.hash(bodyUser.contrasenia,10);
                        await user.update({
                            email: bodyUser.email,
                            contrasenia: hashPassword
                        })
                        await user.save();
        
                        await inqui.update({
                            nombre: body.nombre,
                            apellido: body.apellido,
                            dni: body.dni,
                            telefono: body.telefono
                        })
                        await inqui.save();

                }

                return user;

            } catch (error) {
                return null;
            }
        }
        /* PENDIENTE */
        public deleteUser = async(id: any): Promise<any> =>
            {
                try
                {   
                    const user = await Usuario.findOne({
                        where: {
                            id_usuario: id
                        }
                    });
                    
                    if(user === null)
                    {
                        return null;
                    }
    
                    
                    const deleteInqui = await this.findRelation(id);
                    
                    if(deleteInqui === null)
                    {
                        return null;
                    }
    
                    await user.destroy();
    
                    return deleteInqui; //[inquilino]
    
                }catch(error)
                {
                    console.error("Error al eliminar el usuario:", error);
                    return null;
                }
            }
    
            public findRelation = async(id: any):Promise<any> =>
            {
                try {
                    //Inquilino - Quejas - contrato
                    const inqui = await InquilinoModel.findOne({
                        where: {
                            id_usuario: id
                        }
                    });
                    
                    if(inqui === null)
                    {
                        return null;
                    }


                    const contract = await Contrato.findOne({
                        where: {
                            id_inquilino: id
                        }
                    });
                    
                    // if(contract === null)
                    // {
                    //     return null;
                    // }


                    const claims = await Claim.findAll({
                        where: {
                            id_usuario: id
                        }
                    });
                    
                    // if(claims === null || claims.length === 0)
                    // {
                    //     return null;
                    // }
                    
                    //Eliminar las tablas donde aparece el inquilino
                    if(claims.length !== 0)
                    {
                        for (let i = 0; i < claims.length; i++) {
                            await claims[i].destroy();
                        }
                    }

                    const deleteInqui = await inqui.destroy();

                    if(contract)
                    {
                        await contract.destroy();
                    }

                    return deleteInqui;
                    
                } catch (error) {
                    return null;
                }
    
            }

        public getByEmail = async (email:string): Promise<any> =>{
            try {
                const exist= await Usuario.findOne({where:{
                    email:email
                }});

                
                return exist ? exist.dataValues : null;
                
            } catch (error) {
                return error;
            }
        }
        
        public createUser = async(bodyU: any, bodyI: any): Promise<any> =>{
            try {
                const existEmail= await this.getByEmail(bodyU.email)
    
                if(existEmail !== null){
                    return undefined;
                }

                const hashPassword=await bcrypt.hash(bodyU.contrasenia,10);

                const user = await Usuario.create({
                    email: bodyU.email,
                    contrasenia: hashPassword,
                    rol: 'b'
                });
                const id= user.dataValues.id_usuario;
                const inq = await this.createBasicUser(id,bodyI);

                
                if(inq !== null){
                    return {email: user.dataValues.email};
                }

                return null
              

            } catch (error) {
                return null
            }
        }

        public createBasicUser = async(id: number, bodyI: any): Promise<any> =>{
            try {
                const inq = await InquilinoModel.create({
                    id_usuario: id,
                    dni: bodyI.dni,
                    nombre: bodyI.nombre,
                    apellido: bodyI.apellido,
                    telefono: bodyI.telefono,
                });
                
                return inq ? inq.dataValues: null;
                
            } catch (error) { 
                return null;
                
            }
            
        }

}

export default UserController;