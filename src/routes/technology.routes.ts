import { Router } from 'express';
import { technologyController } from '../controllers/technology.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { createTechnologySchema } from '../dtos/technology.dto';

const router = Router();

router.post('/', validateBody(createTechnologySchema), technologyController.create);
router.get('/', technologyController.getAll);

export default router;
