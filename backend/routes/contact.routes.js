import { Router } from "express";
import { searchContacts } from '../controllers/contact.controller.js'
import authorize from "../middleware/auth.middleware.js";
const contactRouter = Router();

contactRouter.post('/search',authorize, searchContacts);

export default contactRouter;