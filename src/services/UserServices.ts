import {Request, Response} from 'express';
import UserController from '../controllers/UserController'
import UserHelper from '../helpers/UserHelper';
import InquiHelper from '../helpers/InquiHelper';

class UserServices {

    private controller: UserController;
    private helperU: UserHelper;
    private helperI: InquiHelper;
    

    constructor ()
    {
        this.controller = new UserController();
        this.helperU = new UserHelper();
        this.helperI = new InquiHelper();
    }


    public findAll = async(_req: Request, res: Response): Promise<any> => 
    {
        try {
            
            const users = await this.controller.findAll();
            
            if(users.length === 0 || users === null){
                res.status(400).json({message: "No se encontraron usuarios"});
                return;
            }

            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({error: "Hubo un error al intentar buscar los usuarios"})
        }
    }

    public findOne = async(req: Request, res: Response): Promise<any> => 
        {
            try {
                
                const id = req.params.id;

                const isValidId = this.helperU.verifyId(id);

                if(!isValidId || isNaN(parseInt(id)))
                {
                    res.status(404).json({message: "Hubo un error al buscar al usuario. ID no valido"})
                    return;
                }

                const user = await this.controller.findOne(id);
                
                if(user === null){
                    res.status(400).json({message: "No se encontró al usuario"});
                    return;
                }
    
                res.status(200).json({...user});//tiene el array dentro [usuario, inquilino]
    
            } catch (error) {
                res.status(500).json({error: "Hubo un error al intentar buscar el usuario"})
            }
        }

    public updateUser = async(req: Request, res: Response): Promise<any> => 
    {

        try {
            //USUARIO: email y contraseña
            const id = req.params.id;
            const bodyUser = {email: req.body.email, contrasenia: req.body.contrasenia};

            const isValidId = this.helperU.verifyId(id);
            const isValidUser = this.helperU.verifyUserEntry(bodyUser);

            if(!isValidId)
                {
                    res.status(404).json({message: "Hubo un error al buscar al usuario. ID no valido"})
                    return;
                }
        
            if(!isValidUser.success)
            {
                res.status(404).json({error: isValidUser})
                return;
            }

            const typeUser = await this.controller.findOne(id); //devuelve el arreglo [user, tipo de usuario]

            //VEMOS QUE TIPO DE USUARIO ES PARA MODIFICAR SEGUN SUS CAMPOS
            if(typeUser[0].dataValues.rol === "a")
            {
                //INMOBILIARIA: nombre, direc_calle, direc_numero, direc_piso, direc_puerta,
                //hora_apertura, hora_cierre, descripcion
                const bodyInmo = {nombre: req.body.nombre, direc_calle: req.body.direc_calle, direc_numero: req.body.direc_numero,
                    direc_piso: req.body.direc_piso, direc_puerta: req.body.direc_puerta, hora_apertura: req.body.hora_apertura,
                    hora_cierre: req.body.hora_cierre, descripcion: req.body.descripcion
                };

                // const isValidInmo = this.helperI.verifyInmoEntry(bodyInmo);

                // if(!isValidInmo.success)
                // {
                //     res.status(404).json({error: isValidInmo})
                //     return;
                // }

                const user = await this.controller.updateUser(id, bodyUser, bodyInmo);

                if(user === null)
                {
                    res.status(404).json({message: "Algo fallo al buscar a los usuarios"})
                    return;
                }
        
                res.status(200).json(user);
                return;

            }else if(typeUser[0].dataValues.rol === "b")
            {
                //INQUILINO: dni, nombre, apellido, telefono
                const bodyInqui = {dni: req.body.dni, nombre: req.body.nombre, apellido: req.body.apellido, telefono: req.body.telefono};

                const isValidInqui = this.helperI.verifyInquiEntry(bodyInqui);

                if(!isValidInqui.success)
                {
                    res.status(404).json({error: isValidInqui})
                    return;
                }
                
                const user = await this.controller.updateUser(id, bodyUser, bodyInqui);

                if(user === null)
                {
                    res.status(404).json({message: "Algo fallo al buscar a los usuarios"})
                    return;
                }
        
                res.status(200).json(user);
                return;
            }

            //por si falla que no tome el usuario
            res.status(404).json({message: "Algo fallo al buscar a los usuarios"})

        } catch (error) {
            res.status(500).json({error: "No se pudieron modificar los datos"})
        }
    }
    
    /* PENDIENTE */
    public deleteUser = async(req: Request, res: Response): Promise<any> => 
    {
        try
        {
            const id = req.params.id;

            const isValidId = this.helperU.verifyId(id);

            if(!isValidId || isNaN(parseInt(id)))
            {
                res.status(404).json({message: "Hubo un error al intentar borrar al usuario. ID no valido"})
                return;
            }

            const deleteU = await this.controller.deleteUser(id);

            if(deleteU === null)
            {
                res.status(404).json({message: "Ocurrio un error al intentar borrar al usuario"})
                return;
            }

            res.status(200).json(deleteU);

        }catch(error)
        {
            res.status(500).json({error: "Error al intentar borrar al Usuario"})
        }
    }

    public createUser = async(req: Request, res: Response): Promise<any> => 
    {
        try {
            //email, contrasenia,    rol => b

            const bodyU = {email: req.body.email, contrasenia: req.body.contrasenia};
            const bodyI = {dni: req.body.dni, nombre: req.body.nombre, apellido: req.body.apellido, telefono: req.body.telefono};

            const isValidUser = this.helperU.verifyUserEntry(bodyU);
            const isValidInqui = this.helperI.verifyInquiEntry(bodyI);

            if(!isValidUser.success)
            {
                res.status(404).json({error: isValidUser})
                return;
            }

            if(!isValidInqui.success)
            {
                    res.status(404).json({error: isValidInqui})
                    return;
            }

            const user = await this.controller.createUser(bodyU, bodyI);
            
            if(user === null){
                res.status(400).json({error: "Error al crear usuario."});
                return
            }
            if(user === undefined){
                res.status(400).json({error: "Ya existe un usuario con el email ingresado."});
                return;
            }

            res.status(201).json({usuario: {...user}});

        } catch (error) {
            res.status(500).json({error: "Error al intentar crear al Usuario"})
        }
    }
    
}

export default UserServices;