import express from 'express';
import { corsConfig } from './middlewares/Cors';
import Router from './routes/router';
import cors from 'cors';
import {connDB} from './database/connection'
import { dbInit } from './database/dbInit';


export const initApp = () =>{
    const app= express();
    const PORT= process.env.PORT || 3000;
    
    app.use(express.json());
    app.use(cors());
    app.use(corsConfig);

    connDB();
    dbInit();
    
    app.use('/',Router);
    
    app.listen(PORT, ()=>{
        console.log(`server corriendo en ${PORT}`);
        
    });

}