import express from 'express';
import ContractServices from '../services/ContractServices';
import Auth from '../middlewares/Auth';
const RouterContract= express.Router(); 
const services = new ContractServices();
const auth = new Auth();

RouterContract.get('/',services.getAll);
RouterContract.get('/:id',services.findById);

RouterContract.post('/',auth.checkAdminAuth,services.create);
RouterContract.put('/:id',auth.checkAdminAuth,services.update);
RouterContract.delete('/:id',auth.checkAdminAuth, services.delete);

export default RouterContract;