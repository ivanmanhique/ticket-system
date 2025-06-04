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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_1 = require("./email");
const client_1 = require("@prisma/client");
const qrcode_1 = __importDefault(require("qrcode"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const prisma = new client_1.PrismaClient();
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
        const session = event.data.object;
        const email = (_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.email;
        const name = (_c = (_b = session.customer_details) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "Meraki";
        const amount = (session.amount_total || 0) / 100;
        const currency = (_e = (_d = session.currency) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : "PLN_";
        // Generate a ticket
        const ticket = yield prisma.ticket.create({
            data: {
                sessionId: session.id,
                email: email,
            },
        });
        console.log('🎟️ Ticket created:', ticket.id);
        const qrDataUrl = yield qrcode_1.default.toDataURL(ticket.id);
        if (email) {
            yield (0, email_1.sendConfirmationEmail)(email, name, amount, currency, qrDataUrl, ticket);
            yield (0, email_1.sendConfirmationEmail)(process.env.ADMIN_EMAIL, name, amount, currency, qrDataUrl, ticket);
            // await sendConfirmationEmailAdmin(
            // process.env.ADMIN_EMAIL!,
            // 'New Ticket Purchase',
            // `<p>${email} purchased ${amount} ${currency}</p>
            // <p>Here is the ticket QR code:</p>
            // <img src="${qrDataUrl}" alt="Your Ticket QR" />
            //  <p>Ticket ID: ${ticket.id}</p>
            // `
            // );
        }
    }
    res.status(200).json({ received: true });
    return;
});
exports.default = stripeWebhookHandler;
