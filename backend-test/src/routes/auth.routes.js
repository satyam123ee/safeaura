import { Router } from 'express';
import { register, login, googleLogin, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

export default router;
