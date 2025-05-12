import Router from 'express';
import { signIn, signUp, getUserInfo } from '../controllers/auth.controller.js';
import authorize from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/login', signIn);
authRouter.post('/register', signUp);
authRouter.get('/user-info', authorize, getUserInfo);


export default authRouter;