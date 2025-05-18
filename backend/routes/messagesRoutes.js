import Router from 'express';
import { getMessages } from '../controllers/message.controller.js';
import authorize from '../middleware/auth.middleware.js';

const messageRouter = Router();

messageRouter.post('/get-messages', authorize, getMessages);

export default messageRouter;