import { Router } from 'express';
import authRoutes from './auth.routes';
import enrollRoutes from './enroll.routes';
import healthRoutes from './health.routes';
import sponsorRoutes from './sponsor.routes';
import sessionRoutes from './session.routes';
import usersRoutes from './users.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/sessions', sessionRoutes);
router.use('/enroll', enrollRoutes);
router.use('/sponsor', sponsorRoutes);

export default router;
