import express from 'express';
import UserServices from '../services/UserServices';
const services = new UserServices();
const router = express.Router();

router.get('/', services.findAll); //Listo
router.get('/:id', services.findOne); //Listo
router.put('/:id', services.updateUser); //Listo
router.delete('/:id', services.deleteUser); //LISTO
router.post('/', services.createUser); //Listo

export default router;

