import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getInfrastructure = async (req: Request, res: Response) => {
    try {
        const infrastructure = await prisma.infrastructure.findMany({
            where: { active: true }
        });
        res.json(infrastructure);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching infrastructure' });
    }
};

export const createInfrastructure = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const infrastructure = await prisma.infrastructure.create({
            data: { name }
        });
        res.status(201).json(infrastructure);
    } catch (error) {
        res.status(500).json({ message: 'Error creating infrastructure' });
    }
};

export const updateInfrastructure = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, active } = req.body;
        const infrastructure = await prisma.infrastructure.update({
            where: { id: Number(id) },
            data: { name, active }
        });
        res.json(infrastructure);
    } catch (error) {
        res.status(500).json({ message: 'Error updating infrastructure' });
    }
};
