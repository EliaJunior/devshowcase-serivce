import { Router } from 'express';
import profileRoutes from './profile.routes';
import technologyRoutes from './technology.routes';
import projectRoutes from './project.routes';

const router = Router();

router.use('/profiles', profileRoutes);
router.use('/technologies', technologyRoutes);
router.use('/projects', projectRoutes);

export default router;
