import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verificarToken = (req: Request, res: Response, next: NextFunction) =>{

    const headerAutorizacion= req.headers.authorization
    
    if (!headerAutorizacion) {
        res.status(401).json({ error: "Acceso denegado. No hay token." });
        return; 
    }

    const token = headerAutorizacion.split(" ")[1]


    try{

        const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET || "PALABRA_SECRETA_SUPER_DIFICIL");
        
        next();

    }catch(error){
        res.status(403).json({error:"Token invalido o expirado."})
    }
}