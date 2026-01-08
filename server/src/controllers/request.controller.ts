import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getRequests = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        let requests;
        if (role === 'ADMIN') {
            requests = await prisma.request.findMany({
                include: { user: true, equipment: true, category: true },
            });
        } else {
            requests = await prisma.request.findMany({
                where: { userId },
                include: { equipment: true, category: true },
            });
        }
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
};

export const createRequest = async (req: Request, res: Response) => {
    try {
        const { equipmentId, categoryId, description, priority } = req.body;
        const userId = req.user?.id;

        if (!userId) { // Should be caught by middleware but for safety
            res.status(401).json({ message: 'User ID missing' });
            return;
        }

        const newRequest = await prisma.request.create({
            data: {
                userId,
                equipmentId,
                categoryId,
                description,
                priority,
                status: 'PENDING',
            },
        });
        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating request' });
    }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, adminComment } = req.body;

        const updatedRequest = await prisma.request.update({
            where: { id: Number(id) },
            data: {
                status,
                adminComment,
                updatedAt: new Date()
            },
        });
        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error updating request status' });
    }
};
