import { Router } from 'express';
import chatRouter from './chat';
import { getDecisionSearchService } from '../services/decisionSearchService';

const router = Router();

router.use('/chat', chatRouter);

// Debug endpoint for decision search service
router.get('/decisions/status', (_req, res) => {
  try {
    const service = getDecisionSearchService();
    const status = service.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get service status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
