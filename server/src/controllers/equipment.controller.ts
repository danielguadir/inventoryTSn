import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getEquipment = async (req: Request, res: Response) => {
    try {
        const equipment = await prisma.equipment.findMany();
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching equipment' });
    }
};

export const createEquipment = async (req: Request, res: Response) => {
    try {
        const { type, brand, model, serial, status } = req.body;
        const newEquipment = await prisma.equipment.create({
            data: { type, brand, model, serial, status },
        });
        res.status(201).json(newEquipment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating equipment' });
    }
};

export const updateEquipment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await prisma.equipment.update({
            where: { id: Number(id) },
            data,
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating equipment' });
    }
};

export const deleteEquipment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.equipment.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting equipment' });
    }
};

export const assignEquipment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const updated = await prisma.equipment.update({
            where: { id: Number(id) },
            data: {
                assignedToUserId: userId,
                status: userId ? 'ASSIGNED' : 'AVAILABLE',
            },
        });

        // Also create an Assignment record if being assigned
        if (userId) {
            await prisma.assignment.create({
                data: {
                    equipmentId: Number(id),
                    userId: Number(userId),
                    assignedBy: req.user?.id,
                }
            });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning equipment' });
    }
};
