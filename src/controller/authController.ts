import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';
import { error } from 'node:console';
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient()



export const nuevoUsuario = async(req: Request, res: Response) =>{

    const {nombre, password, email} = req.body

    if((!password || !nombre || !email)){
            res.status(400).json({error: "Complete todos los campos"})
            return
        }

    try{
        
        const emailExistente = await prisma.usuario.findUnique({
            where: {email :email}
        })

        if(emailExistente){
            res.status(400).json({error: "Ya existe un usuario creado con ese mail. Porfavor ingrese otro mail"})
            return
        }


        const saltRounds = 10;
        const passHasheada= await bcrypt.hash(password, saltRounds)

        const nuevoUsuarioCreado= await  prisma.usuario.create({
            data:{
                nombre:nombre,
                email: email,
                password:passHasheada
            }
        })

        res.status(201).json({
            message: "Usuario creado con exito",
            usuario:{
                id: nuevoUsuarioCreado.id,
                nombre: nuevoUsuarioCreado.nombre,
                email: nuevoUsuarioCreado.email
            }})

    }catch{
        console.log(error)
        res.status(500).json({error:"Error al crear el usuario"})
    }

}


export const login = async (req:Request, res:Response) =>{


    const {email, password} = req.body

    if(!email || !password){
        res.status(400).json({error: "Los campos son obligatorios"})
        return;
    }

    try{
        const usuarioBuscado= await prisma.usuario.findUnique({
            where:{email:email}
        })


        if(!usuarioBuscado){
            res.status(400).json({error:"Credenciales inválidas"})
            return
        }

        const validaPass = await bcrypt.compare(password, usuarioBuscado.password)

        if(validaPass==false){
            res.status(400).json({error:"Credenciales inválidas"})
            return
        }else{
                
            const token = jwt.sign(
            { userId: usuarioBuscado.id }, 
            process.env.JWT_SECRET || 'PALABRA_SECRETA_SUPER_DIFICIL', 
            { expiresIn: '1h' }
        );

        res.json({
            mensagge:"Bienvenido",
            token: token,
            usuario:{
                usuario:{
                    nombre: usuarioBuscado.nombre,
                    email: usuarioBuscado.email
                }
            }
        })

        }
    }catch{
        res.status(500).json({error: "Error en el servidor"})
    }
    
}