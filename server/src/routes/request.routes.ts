import { Router } from 'express';
import { getRequests, createRequest, updateRequestStatus } from '../controllers/request.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getRequests);
router.post('/', authenticateToken, createRequest);
router.put('/:id/status', authenticateToken, requireAdmin, updateRequestStatus);

export default router;
