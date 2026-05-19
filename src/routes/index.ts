import { Router } from 'express';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import contentRoutes from './content.routes';
import enrollRoutes from './enroll.routes';
import healthRoutes from './health.routes';
import learningRoutes from './learning.routes';
import organizationRoutes from './organization.routes';
import sponsorRoutes from './sponsor.routes';
import sessionRoutes from './session.routes';
import usersRoutes from './users.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admins', adminRoutes);
router.use('/organizations', organizationRoutes);
router.use('/users', usersRoutes);
router.use('/sessions', sessionRoutes);
router.use('/enroll', enrollRoutes);
router.use('/sponsor', sponsorRoutes);
router.use('/learning', learningRoutes);
router.use('/content', contentRoutes);

export default router;
