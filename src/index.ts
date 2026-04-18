import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import clienteRoutes from './routes/clienteRoutes'
import authRoutes from './routes/authRoutes'

const app = express()
const prisma = new PrismaClient()
const PORT = Number(process.env.PORT) || 3000

// Detectamos el entorno
const isProduction = process.env.NODE_ENV === 'production'

// Configuración de CORS: En local permite todo o tu puerto de Vite, en prod solo tu dominio de Vercel
app.use(cors({
  origin: isProduction ? "https://morosos-frontend.vercel.app" : "*" 
}))

app.use(express.json())

// Rutas
app.use('/api/clientes', clienteRoutes)
app.use('/api/auth', authRoutes)

// Lógica de Auto-ping: SOLO se ejecuta en producción para que Render no se duerma
if (isProduction) {
  const MI_URL_DE_RENDER = "https://api-morosos.onrender.com/"
  setInterval(() => {
    fetch(MI_URL_DE_RENDER)
      .then(() => console.log("⏰ Auto-ping exitoso: Servidor despierto"))
      .catch((error) => console.error("Error en el auto-ping:", error));
  }, 600000); // 10 minutos
} else {
  console.log("🛠️ Entorno de desarrollo: Auto-ping desactivado.")
}

app.get('/', (req, res) => {
  res.send(`¡La API de Deudores está VIVA! 💸 (Modo: ${process.env.NODE_ENV})`)
})

app.get('/test-db', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany()
    res.json({ 
      mensaje: "Conexión exitosa con la BD", 
      entorno: process.env.NODE_ENV,
      cantidadClientes: clientes.length 
    })
  } catch (error) {
    res.status(500).json({ error: "Error al conectar con la BD", detalle: error })
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`🌍 Entorno actual: ${process.env.NODE_ENV}`)
})