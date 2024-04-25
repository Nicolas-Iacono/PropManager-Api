import { NextFunction, Request, Response } from 'express';

export const corsConfig = (_req:Request, res:Response, next:NextFunction) =>{
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}