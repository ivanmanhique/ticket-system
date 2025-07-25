"use strict";
// import express from 'express';
// import Stripe from 'stripe';
// import { Request, Response, NextFunction } from 'express';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
// import { sendConfirmationEmail } from './email';
// import { PrismaClient } from '@prisma/client';
// import QRCode from 'qrcode';
// import cors from 'cors';
// dotenv.config();
// const prisma = new PrismaClient();
// const app = express();
// app.use(cors()); // allow all origins
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// const stripeWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
//     const sig = req.headers['stripe-signature']!;
//     let event: Stripe.Event;
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET!
//       );
//     } catch (err) {
//       console.error(`Webhook Error: ${(err as Error).message}`);
//       res.status(400).send(`Webhook Error`);
//       return;
//     }
//     if (event.type === 'checkout.session.completed') {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const email = session.customer_details?.email;
//         const amount = (session.amount_total || 0) / 100;
//         const currency = session.currency?.toUpperCase();
//         // Generate a ticket
//         const ticket = await prisma.ticket.create({
//             data: {
//             sessionId: session.id,
//             email: email!,
//             },
//         });
//         console.log('🎟️ Ticket created:', ticket.id);
//         const qrDataUrl = await QRCode.toDataURL(ticket.id);
//         if (email) {
//             const html = `
//             <p>Hi,</p>
//             <p>Thank you for your purchase of <strong>${amount} ${currency}</strong>.</p>
//             <p>Here is your ticket QR code:</p>
//             <img src="${qrDataUrl}" alt="Your Ticket QR" />
//              <p>Ticket ID: ${ticket.id}</p>
//             `;
//             await sendConfirmationEmail(email, 'Ticket Purchase Confirmation', html);
//             await sendConfirmationEmail(
//             process.env.ADMIN_EMAIL!,
//             'New Ticket Purchase',
//             `<p>${email} purchased ${amount} ${currency}</p>
//             <p>Here is the ticket QR code:</p>
//             <img src="${qrDataUrl}" alt="Your Ticket QR" />
//              <p>Ticket ID: ${ticket.id}</p>
//             `
//             );
//         }
//     }
//     res.status(200).json({ received: true });
//     return;
//   };
// const verifyTicket = async (req: Request, res: Response, next: NextFunction) => {
//     const { ticketId } = req.body;
//   const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
//   if (!ticket) {
//     res.status(404).json({ valid: false, reason: 'Not found' });
//     return;
// }
//     if (ticket.used) {
//         res.status(400).json({ valid: false, reason: 'Already used' });
//         return;
//     }
//     await prisma.ticket.update({ where: { id: ticketId }, data: { used: true } });
//     res.json({ valid: true, userEmail: ticket.email });
//     return;
// };
// app.post('/webhook',bodyParser.raw({ type: 'application/json' }),stripeWebhookHandler);
// app.use(express.json())
// app.post('/verify-ticket', verifyTicket);
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
