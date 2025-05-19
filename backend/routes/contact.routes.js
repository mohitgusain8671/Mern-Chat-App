import { Router } from "express";
import { getDMContacts, searchContacts } from '../controllers/contact.controller.js'
import authorize from "../middleware/auth.middleware.js";
const contactRouter = Router();

contactRouter.post('/search',authorize, searchContacts);
contactRouter.get('/dm-contacts', authorize, getDMContacts);

export default contactRouter;