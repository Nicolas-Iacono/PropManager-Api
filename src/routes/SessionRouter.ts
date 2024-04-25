import express from 'express';
import SessionServices from '../services/SessionServices';
const SessionRouter= express.Router()
const services= new SessionServices()

SessionRouter.post('/', services.verifyUser);

export default SessionRouter;