import { Router } from 'express';
import { getCategories, createCategory, updateCategory } from '../controllers/category.controller';

const router = Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);

export default router;
