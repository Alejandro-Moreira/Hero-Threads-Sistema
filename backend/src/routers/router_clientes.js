import express  from "express";
import { 
  actualizarCliente,
  borrarCliente,
  buscarCliente,
  mostrarClientes,
  registrarCliente,
  registrarClientePublico
} from "../controllers/clientes_controllers.js";

import { verificadoAutentication } from "../controllers/login_controllers.js"

const routerCliente = express.Router()

routerCliente.use(express.json())


  routerCliente.get('/listar', verificadoAutentication,  mostrarClientes);
  
  routerCliente.get('/obtener/:id', verificadoAutentication,  buscarCliente);
  
  routerCliente.post('/register', verificadoAutentication,  registrarCliente);
  
  // Public registration endpoint (no authentication required)
  routerCliente.post('/register/public', registrarClientePublico);
  
  
  routerCliente.put('/actualizar/:id', verificadoAutentication,  actualizarCliente);
  
  routerCliente.delete('/eliminar/:id', verificadoAutentication,  borrarCliente);
  
  routerCliente.use((req, res) => res.status(404).end())

export default routerCliente