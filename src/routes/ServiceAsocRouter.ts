import express from 'express';
import ServiceAsocServices from '../services/ServiceAsocServices';
const RouterServAsoc = express.Router();
const services= new ServiceAsocServices();


RouterServAsoc.post('/', services.create);
RouterServAsoc.put('/:id',services.update);
RouterServAsoc.delete('/:id', services.delete);
//////servicio de un contrato en un cierto estado (pagado, cerca de vencer, impago)
////servicio de un contrato con fecha de servicio tal
export default RouterServAsoc;