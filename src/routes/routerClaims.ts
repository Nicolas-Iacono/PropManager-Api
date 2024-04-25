import express from 'express';
import servicesClaims from '../services/servicesClaims';
import Auth from '../middlewares/Auth';
const router = express.Router();
const services = new servicesClaims();
const auth = new Auth();

router.get('/', services.findAll);
router.put('/:id', auth.checkAdminAuth,services.updateClaim);
router.delete('/:id', auth.checkAdminAuth,services.deleteClaim);
router.post('/', services.createClaim);
router.get('/:id', services.findOne);


export default router;

