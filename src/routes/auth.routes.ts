import { Router } from 'express';
import { login, register, validateToken, getUserDetails } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', authenticate, validateToken);
router.get('/user', authenticate, getUserDetails);

export { router as authRouter };
