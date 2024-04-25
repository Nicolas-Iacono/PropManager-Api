//devuelve el json
import {Request, Response} from 'express'
import controllerClaims from '../controllers/controllerClaims';
import ClaimHelper from '../helpers/ClaimHelper';

class servicesClaims {

    private controller: controllerClaims;
    private helper: ClaimHelper;

    constructor()
    {
        this.controller = new controllerClaims();
        this.helper = new ClaimHelper();
    }

    public findAll = async(req: Request, res: Response): Promise<void> => 
    {
        const user = {id_usuario:req.body.userId, rol:req.body.userRol};
        
        const id = req.body.userId;
        const cleanIdUser = this.helper.verifyId(id);

        if(!cleanIdUser || isNaN(parseInt(id)))
            {
                res.status(404).json({message: "Hubo un error al buscar la queja. Id no valido"});
                return;
            }

        try {
            const claims = await this.controller.findAllClaims(user);


            if(claims.length === 0)
                {
                    res.status(201).json({message: "No se encontraron quejas"});
                    return
                }
            res.json(claims);
        } catch (error) {
            res.status(500).json({error: 'Error al buscar las quejas'})
        }
    }

    public updateClaim = async(req: Request, res: Response): Promise<any> => 
    {
        try {
            const user = {id_usuario:req.body.userId, rol:req.body.userRol};
            console.log(user)

            const idClaim = req.params.id;
            const cleanIdClaim = this.helper.verifyId(idClaim);

            const state = req.body.estado;
            const cleanState = this.helper.verifyState(state);

            if(!cleanIdClaim || isNaN(parseInt(idClaim)))
            {
                res.status(404).json({message: "Hubo un error al buscar la queja. Id no valido"});
                return;
            }

            if (!cleanState)
            {
                res.status(404).json({message: "Estado no valido"})
                return;
            }


            const claim = await this.controller.updateStatusClaim(user, idClaim, state);
    
            if(claim === null){
                res.status(400).json({message: "Hubo un error al intentar modificar la queja."})
                return;
            }
    
            res.status(200).json(claim);

        } catch (error) {
            res.status(500).json({message: 'Error al modificar la queja'})
        }
    }

    public deleteClaim = async(req: Request, res: Response): Promise<any> => 
    {
        try {
            const user = {id_usuario:req.body.userId, rol:req.body.userRol};

            const id = req.params.id;
            const cleanIdInqui = this.helper.verifyId(id);

            if(!cleanIdInqui || isNaN(parseInt(id)))
            {
                res.status(404).json({message: "Hubo un error al intentar borrar la queja. Id no valido"});
                return;
            }


            const claim = await this.controller.deleteClaim(user, id);

            if(claim === null){
                res.status(400).json({message: "Hubo un error al intentar borrar la queja."})
                return;
            }

            res.status(200).json(claim); //retorna en realidad el usuario, por que la queja se borró

        } catch (error) {
            res.status(500).json({message: 'Error al intentar borrar la queja'})
        }
    }
    
    public createClaim = async(req: Request, res: Response): Promise<any> => 
    {
        try {
            const user = {id_usuario:req.body.userId, rol:req.body.userRol};

            const body = {
                id_usuario: req.body.userId,
                id_contrato: req.body.id_contrato,
                descripcion: req.body.descripcion,
                estado: req.body.estado,
                tipo: req.body.tipo
            };

            const cleanClaim = this.helper.verifyClaim(body);

            if (!cleanClaim.success)
            {
                //como le digo en que fallo?
                res.status(404).json({error: cleanClaim})
                return;
            }
            
            const claim = await this.controller.createClaim(user, body);
            //recibis un "OK" o un null

            if(claim === null)
            {
                res.status(400).json({message: "Hubo un error al intentar crear la queja."})
                return;
            }

            res.status(201).json(claim);
            
        } catch (error) {
            res.status(500).json({error: 'Error al crear la queja'})
        }
    }

    public findOne = async(req: Request, res:Response):Promise<void> =>
    {
        try {
            const idClaim = req.params.id;
            const cleanIdClaim = this.helper.verifyId(idClaim);

            if(!cleanIdClaim || isNaN(parseInt(idClaim)))
            {
                res.status(404).json({message: "Hubo un error al buscar la queja. Id no valido"});
                return;
            }


            const claim = await this.controller.findClaim(idClaim);
    
            if (claim === null)
            {
                res.status(400).json({message: "Hubo un error al intentar buscar la queja con ese ID"})
                return;
            }
    
            res.json(claim);
        } catch (error) {
            res.status(500).json({error: 'Error al buscar la queja'})
        }
    }
}


export default servicesClaims;