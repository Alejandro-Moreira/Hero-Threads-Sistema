import express from 'express';
import { 
    registerUser, 
    forgotPassword,
    validateResetToken,
    resetPassword,
    getGoogleAuthUrl, 
    handleGoogleCallback 
} from '../controllers/auth_controllers.js';

const routerAuth = express.Router();

routerAuth.use(express.json());

routerAuth.post('/register', registerUser);

routerAuth.post('/forgot-password', forgotPassword);
routerAuth.get('/validate-reset-token/:token', validateResetToken);
routerAuth.post('/reset-password', resetPassword);

routerAuth.get('/google/url', getGoogleAuthUrl);
routerAuth.post('/google/callback', handleGoogleCallback);

routerAuth.use((req, res) => res.status(404).end());

export default routerAuth; 