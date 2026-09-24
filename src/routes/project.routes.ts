import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { feedbackController } from '../controllers/feedback.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { createProjectSchema } from '../dtos/project.dto';
import { createFeedbackSchema } from '../dtos/feedback.dto';

const router = Router();

router.post('/', validateBody(createProjectSchema), projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

// Rotas aninhadas para feedbacks do projeto
router.post('/:id/feedbacks', validateBody(createFeedbackSchema), feedbackController.create);
router.get('/:id/feedbacks', feedbackController.getByProjectId);

export default router;
