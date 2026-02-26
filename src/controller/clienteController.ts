import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const crearCliente = async (req :Request, res :Response) =>{


    try{
        const {nombre}= req.body;

        if(!nombre){
            res.status(400).json({ error: "El nombre es obligatorio" });
            return;
        }
    

        const nuevoCliente = await prisma.cliente.create({
            data:{nombre: nombre} 
        })

        res.json(nuevoCliente)        

    }
    catch(error){
        res.status (500).json ({error: "Error al crear el cliente"})
    }
    
}

export const obtenerClientes= async (req:Request,res:Response)=>{

    try{
        const clientes=  await prisma.cliente.findMany()
        res.json(clientes)
    }
    catch(error){
        res.status (500).json ({error: "Error al cargar la lista de clientes"})
    }
}

export const eliminarCliente = async (req: Request, res: Response) =>{

    try{
        const {id} = req.body;

    
        if(!id){
            res.status(500).json ("Error, Id vacio")
            return;
        }

        const clienteBuscado = await prisma.cliente.findUnique({ where: { id: id } })

        if(!clienteBuscado){
            res.status(404).json("No existe ese cliente con ese ID")
            return
        }

        console.log("🔥🔥🔥 ¡ENTRÓ AL BACKEND NUEVO! 🔥🔥🔥");
        console.log("El saldo de", clienteBuscado.nombre, "es:", clienteBuscado.saldo);
        
        const saldo= clienteBuscado.saldo.toNumber()

        if(saldo !==0 ){
            res.status(400).json({ error: "No se puede eliminar un cliente con saldo distinto a 0" })
            return
        }

        const clienteBorrado = await prisma.cliente.delete({ where: { id: id } })

        res.json(clienteBorrado)

    }
    catch(error){
        res.status(500).json({error: "Error al eliminar cliente"}) 
    }
    
}

export const actualizarMonto= async(req: Request, res: Response)=>{

    try{

        const {id}= req.params

        const {monto}= req.body

        const idNumero = Number(id);
        const montoNumero = Number(monto);
        
        const clienteActual = await prisma.cliente.findUnique({
            where: {
                id : idNumero
            }
        })

        if (!clienteActual) {
            res.status(404).json({error: "Cliente no encontrado"});
            return;
        }

        const saldoAnterior=  Number(clienteActual.saldo);

        let tipoDeMovimiento = ("");
        let categoriaDeMovimiento = ("");

        // DEUDA, PAGO
        
        if(montoNumero>0){
            tipoDeMovimiento = "DEUDA"

            if(saldoAnterior === 0 ){
                categoriaDeMovimiento  = "NUEVA DEUDA"
            } else{
               categoriaDeMovimiento  = "SUMA DEUDA" 
            }
        }else { 
             tipoDeMovimiento = "PAGO"

             const saldoFinal = saldoAnterior+ montoNumero
        
             if(saldoFinal === 0 ){
                categoriaDeMovimiento  ="PAGA TOTAL DEUDA"
             }else{
                categoriaDeMovimiento  ="PAGA DEUDA"

             }
        }

        const resultadoTransaccion = await prisma.$transaction([

            prisma.movimiento.create({
                data: {
                    clienteId : idNumero,
                    fecha : new Date(),
                    descripcion :categoriaDeMovimiento,
                    monto : montoNumero, 
                    tipo : tipoDeMovimiento
                }
            }),


            prisma.cliente.update({
            where: {
                 id : Number(id) 
                },
            data: {
                saldo: {
                    increment : Number (monto)
                }
            }   
        })
        ])

        res.json(resultadoTransaccion[1])
    }
    catch(error){
        res.status(500).json({error  : "Error al actualizar monto"})
    }

}

export const obtenerDetalleCliente = async (req: Request, res: Response) =>{

        try{
             const {id}= req.params


            const cliente = await prisma.cliente.findUnique({
                where:{
                    id: Number(id)
                },
                include:{
                    movimientos:true
                }
            });

            
            if(!cliente){
                res.status(404).json({error: "Cliente no encontrado"})
                return;
            }
                
            res.json(cliente)
        }
        catch(error){
            res.status(500).json({error: "Error al obtener detalle"})
        }
       
} 

export const updateCliente = async (req: Request, res : Response) =>{

    const {id ,nombre,telefono} = req.body


    if(!id){
        res.status(400).json("El id no puede estar vacio")
        return
    } 
  
    try{

        const clienteModificado= await prisma.cliente.update({
            where : { 
                id: id
            },
            data : {
                nombre: nombre,
                telefono :  telefono
            }
        })

        res.json(clienteModificado);

    }catch{
        res.status(400).json("No se pudo actualizar el cliente")
    }


}
