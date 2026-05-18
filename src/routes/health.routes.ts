import { Router } from 'express';
import * as healthController from '../controllers/health.controller';

const router = Router();

router.get('/', healthController.getRoot);
router.get('/health', healthController.getHealth);

export default router;
