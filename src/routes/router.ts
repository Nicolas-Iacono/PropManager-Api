import express from 'express';
import PropRouter from './PropRouter';
import ContractRouter from './ContractRouter';
import SessionRouter from './SessionRouter';
import RouterServAsoc from './ServiceAsocRouter';
import routerClaims from './routerClaims';
import UserRouter from './UserRouter';
import Auth from '../middlewares/Auth';
const Router=express.Router();
const auth=new Auth();



Router.use('/auth', SessionRouter)
Router.use('/contratos',auth.checkToken, ContractRouter);
Router.use('/propiedades',auth.checkToken, auth.checkAdminAuth, PropRouter);
Router.use('/servicios',auth.checkToken,auth.checkAdminAuth,RouterServAsoc );
Router.use('/quejas', auth.checkToken, routerClaims);
Router.use('/usuarios', auth.checkToken, auth.checkAdminAuth, UserRouter);


export default Router;