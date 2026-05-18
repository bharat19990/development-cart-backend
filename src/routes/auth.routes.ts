import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { LoginDto } from '../validators/login.validator';
import { RegisterDto } from '../validators/register.validator';

const router = Router();

router.post('/register', validateBody(RegisterDto), authController.register);
router.post('/login', validateBody(LoginDto), authController.login);

export default router;
