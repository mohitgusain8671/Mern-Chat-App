import Router from 'express';
import { getMessages, uploadFile } from '../controllers/message.controller.js';
import authorize from '../middleware/auth.middleware.js';
import multer from 'multer'

const messageRouter = Router();
const upload = multer({dest: 'uploads/files'});

messageRouter.post('/get-messages', authorize, getMessages);
messageRouter.post('/upload-file', authorize, upload.single("file"), uploadFile )

export default messageRouter;