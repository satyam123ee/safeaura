import { Router } from 'express';
import { addContact, listContacts, deleteContact } from '../controllers/contact.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/', addContact);
router.get('/', listContacts);
router.delete('/:id', deleteContact);

export default router;
