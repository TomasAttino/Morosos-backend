import { Router } from "express"
import { actualizarMonto, crearCliente, eliminarCliente, obtenerClientes, obtenerDetalleCliente, updateCliente } from "../controller/clienteController"
import { verificarToken } from "../middlewares/authMiddleware"

const router = Router ()

router.post('/',verificarToken, crearCliente)
router.get('/',verificarToken, obtenerClientes)
router.delete('/',verificarToken, eliminarCliente)
router.put('/editar',verificarToken, updateCliente)
router.put('/:id',verificarToken, actualizarMonto)
router.get('/:id',verificarToken, obtenerDetalleCliente)


export default router