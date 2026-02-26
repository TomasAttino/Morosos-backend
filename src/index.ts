import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import clienteRoutes from './routes/clienteRoutes'
import authRoutes from './routes/authRoutes'


const app = express()
const prisma = new PrismaClient()
const PORT = 3000

app.use(cors())

app.use(express.json())

app.use('/api/clientes', clienteRoutes)
app.use('/api/auth', authRoutes)



app.get('/', (req, res) => {
  res.send('¡La API de Deudores está VIVA! 💸')
})

app.get('/test-db', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany()
    res.json({ mensaje: "Conexión exitosa con la BD", cantidadClientes: clientes.length })
  } catch (error) {
    res.status(500).json({ error: "Error al conectar con la BD" })
  }
})



app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})

