import { Router } from "express"
import {nuevoUsuario,login } from "../controller/authController"


const router = Router ()


router.post('/registro',nuevoUsuario)
router.post('/login',login)


export default router