import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const verifyTicket = async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

  if (!ticket) {
    res.status(404).json({ valid: false, reason: 'Not found' });
    return;
}
    if (ticket.used) {
        res.status(400).json({ valid: false, reason: 'Already used' });
        return;
    }

    await prisma.ticket.update({ where: { id: ticketId }, data: { used: true } });

    res.json({ valid: true, userEmail: ticket.email });
    return;
};

export default verifyTicket;