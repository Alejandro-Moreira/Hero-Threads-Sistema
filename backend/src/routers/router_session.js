import express from 'express';
import { updateActivity, getSessionInfo } from '../controllers/session_controllers.js';

const routerSession = express.Router();

// POST - Update user activity
routerSession.post('/update-activity', updateActivity);

// GET - Get session info for user
routerSession.get('/info/:userId', getSessionInfo);

routerSession.use((req, res) => res.status(404).end());

export default routerSession; 