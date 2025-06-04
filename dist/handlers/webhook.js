"use strict";
// import Stripe from 'stripe';
// import { Request, Response, NextFunction } from 'express';
// import dotenv from 'dotenv';
// import { sendConfirmationEmail, sendConfirmationEmailAdmin } from './email';
// import { PrismaClient } from '@prisma/client';
// import QRCode from 'qrcode';
// import { v2 as cloudinary } from 'cloudinary';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// const prisma = new PrismaClient();
// async function uploadQrToCloudinary(data: string): Promise<string> {
//   // Generate QR code buffer (png)
//   const qrBuffer = await QRCode.toBuffer(data, { width: 300 });
//   // Upload buffer to Cloudinary (returns Promise with URL)
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'tickets',
//         resource_type: 'image',
//         public_id: `ticket_${Date.now()}`,
//         overwrite: true,
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result!.secure_url);
//       }
//     );
//     stream.end(qrBuffer);
//   });
// }
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
//         const name = session.customer_details?.name ?? "Meraki";
//         const amount = (session.amount_total || 0) / 100;
//         const currency = session.currency?.toUpperCase() ?? "PLN_";
//         // Generate a ticket
//         const ticket = await prisma.ticket.create({
//             data: {
//             sessionId: session.id,
//             email: email!,
//             },
//         });
//         console.log('🎟️ Ticket created:', ticket.id);
//         // const qrDataUrl = await QRCode.toDataURL(ticket.id);
//         const qrDataUrl = await uploadQrToCloudinary(ticket.id);
//         console.log('ticket url: ', qrDataUrl);
//         if (email) {
//             console.log('hereeee ');
//             await sendConfirmationEmail(email, name, amount, currency, qrDataUrl, ticket );
//             await sendConfirmationEmailAdmin(
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
//   export default stripeWebhookHandler;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_1 = require("./email");
const client_1 = require("@prisma/client");
const qrcode_1 = __importDefault(require("qrcode"));
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const prisma = new client_1.PrismaClient();
function uploadQrToCloudinary(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate QR code as a buffer
            const qrBuffer = yield qrcode_1.default.toBuffer(data, {
                type: 'png',
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000', // QR code color
                    light: '#ffffff' // Background color
                }
            });
            // Convert buffer to stream
            const stream = stream_1.Readable.from(qrBuffer);
            // Upload to Cloudinary
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: 'tickets',
                    resource_type: 'image',
                    public_id: `ticket_${Date.now()}`,
                    overwrite: true,
                }, (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    }
                    else {
                        resolve(result.secure_url);
                    }
                });
                stream.pipe(uploadStream);
            });
        }
        catch (error) {
            console.error('QR generation error:', error);
            throw error;
        }
    });
}
const stripeWebhookHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error`);
        return;
    }
    if (event.type === 'checkout.session.completed') {
        try {
            const session = event.data.object;
            const email = (_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.email;
            const name = (_c = (_b = session.customer_details) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "Meraki";
            const amount = (session.amount_total || 0) / 100;
            const currency = (_e = (_d = session.currency) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : "PLN";
            // Generate a ticket
            const ticket = yield prisma.ticket.create({
                data: {
                    sessionId: session.id,
                    email: email,
                },
            });
            console.log('🎟️ Ticket created:', ticket.id);
            // Generate QR code and upload to Cloudinary
            const qrDataUrl = yield uploadQrToCloudinary(ticket.id);
            console.log('Ticket QR URL: ', qrDataUrl);
            if (email) {
                // Send emails
                yield Promise.all([
                    (0, email_1.sendConfirmationEmail)(email, name, amount, currency, qrDataUrl, ticket),
                    (0, email_1.sendConfirmationEmailAdmin)(process.env.ADMIN_EMAIL, 'New Ticket Purchase', `<p>${email} purchased ${amount} ${currency}</p>
            <p>Here is the ticket QR code:</p>
            <img src="${qrDataUrl}" alt="Your Ticket QR" />
            <p>Ticket ID: ${ticket.id}</p>
            `)
                ]);
            }
            res.status(200).json({ received: true });
            return;
        }
        catch (error) {
            console.error('Error processing checkout session:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }
    res.status(200).json({ received: true });
    return;
});
exports.default = stripeWebhookHandler;
