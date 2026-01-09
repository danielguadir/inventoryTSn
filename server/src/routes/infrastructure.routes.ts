import { Router } from 'express';
import { getInfrastructure, createInfrastructure, updateInfrastructure } from '../controllers/infrastructure.controller';

const router = Router();

router.get('/', getInfrastructure);
router.post('/', createInfrastructure);
router.put('/:id', updateInfrastructure);

export default router;
