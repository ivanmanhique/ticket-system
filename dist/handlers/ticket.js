"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verifyTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.body;
    const ticket = yield prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
        res.status(404).json({ valid: false, reason: 'Not found' });
        return;
    }
    if (ticket.used) {
        res.status(400).json({ valid: false, reason: 'Already used' });
        return;
    }
    yield prisma.ticket.update({ where: { id: ticketId }, data: { used: true } });
    res.json({ valid: true, userEmail: ticket.email });
    return;
});
exports.default = verifyTicket;
