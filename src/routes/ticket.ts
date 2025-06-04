import { Router } from "express";
import verifyTicket from "../handlers/ticket";
const ticket_router = Router();

ticket_router.post('/verify-ticket', verifyTicket);

export default ticket_router;