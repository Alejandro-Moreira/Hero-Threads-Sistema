import express from 'express';
import { sendConfirmationEmail, sendOrderConfirmation, verifyEmail } from '../controllers/email_controllers.js';

const routerEmail = express.Router();

routerEmail.use(express.json());

// POST - Send confirmation email
routerEmail.post('/send-confirmation', sendConfirmationEmail);

// POST - Send order confirmation email
routerEmail.post('/send-order-confirmation', sendOrderConfirmation);

// GET - Verify email with token
routerEmail.get('/verify/:token', verifyEmail);

routerEmail.use((req, res) => res.status(404).end());

export default routerEmail; 