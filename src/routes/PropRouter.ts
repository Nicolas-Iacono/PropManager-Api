import express from 'express';
import PropServices from '../services/PropServices';
const RouterProp=express.Router();
const services= new PropServices();



RouterProp.get('/', services.getAll); 
RouterProp.get('/:id',services.findById);  //tambien para filtrar por DNI

RouterProp.post('/',services.create);
RouterProp.put('/:id',services.update);
RouterProp.delete('/:id',services.delete);

export default RouterProp;