import { Router } from 'express';

import { postChatSchema } from '../schemas/chatSchemas'
import { chatController } from '../controllers/chat';
import { validateData } from '../middleware/validationMiddleware';

const router = Router();

// POST /api/chat
router.post('/', (req, _res, next) => {
  console.log('[ChatRoute] POST /api/chat received');
  console.log('[ChatRoute] Body:', req.body);
  next();
}, validateData(postChatSchema), chatController);

export default router