import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.damageCategory.findMany({
            where: { active: true }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const category = await prisma.damageCategory.create({
            data: { name }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, active } = req.body;
        const category = await prisma.damageCategory.update({
            where: { id: Number(id) },
            data: { name, active }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
};
