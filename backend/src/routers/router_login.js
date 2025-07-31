import express from 'express';
import { inicioLogin, registroLogin } from '../controllers/login_controllers.js';

const routerLogin = express.Router();

routerLogin.use(express.json());

registroLogin()

routerLogin.post('/',inicioLogin);

routerLogin.use((req, res) => res.status(404).end())

export default routerLogin;