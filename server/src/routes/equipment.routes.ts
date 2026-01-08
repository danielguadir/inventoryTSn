import { Router } from 'express';
import { getEquipment, createEquipment, updateEquipment, deleteEquipment, assignEquipment } from '../controllers/equipment.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getEquipment); // Users can view
router.post('/', authenticateToken, requireAdmin, createEquipment); // Only admin can create
router.put('/:id', authenticateToken, requireAdmin, updateEquipment);
router.delete('/:id', authenticateToken, requireAdmin, deleteEquipment);
router.post('/:id/assign', authenticateToken, requireAdmin, assignEquipment);

export default router;
