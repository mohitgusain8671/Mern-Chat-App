import { Router } from "express";
import { deleteContact, getAllContacts, getDMContacts, searchContacts } from '../controllers/contact.controller.js'
import authorize from "../middleware/auth.middleware.js";
const contactRouter = Router();

contactRouter.post('/search',authorize, searchContacts);
contactRouter.get('/dm-contacts', authorize, getDMContacts);
contactRouter.get('/get-all-contacts', authorize, getAllContacts);
contactRouter.delete('/delete-contact', authorize, deleteContact);

export default contactRouter;