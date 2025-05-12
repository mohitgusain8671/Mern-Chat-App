import Router from 'express';
import { signIn, signUp, getUserInfo, updateProfile, addImage, removeImage } from '../controllers/auth.controller.js';
import authorize from '../middleware/auth.middleware.js';
import multer from "multer";

const authRouter = Router();
const upload = multer({dest:"uploads/profiles/"});

authRouter.post('/login', signIn);
authRouter.post('/register', signUp);
authRouter.get('/user-info', authorize, getUserInfo);
authRouter.post('/update-profile', authorize, updateProfile);
authRouter.post('/add-image',
    authorize,
    upload.single('profile-image'),
    addImage
);
authRouter.delete('/remove-image',authorize, removeImage);



export default authRouter;