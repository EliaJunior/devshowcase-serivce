import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { createProfileSchema } from '../dtos/profile.dto';

const router = Router();

router.post('/', validateBody(createProfileSchema), profileController.create);
router.get('/:id', profileController.getById);
router.get('/', profileController.getAll);

export default router;
