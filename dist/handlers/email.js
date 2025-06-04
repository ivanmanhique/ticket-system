"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationEmail = sendConfirmationEmail;
exports.sendConfirmationEmailAdmin = sendConfirmationEmailAdmin;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
function sendConfirmationEmail(to, _name, amount, currency, qrDataUrl, ticket) {
    const msg = {
        to,
        from: process.env.ADMIN_EMAIL, // Your verified SendGrid sender
        templateId: 'd-5147e095f0304d98bf4c326aa487d32c',
        dynamic_template_data: {
            name: _name,
            amount: amount,
            currency: currency,
            qrCodeImage: qrDataUrl, // Data URL
            ticketId: ticket.id
        }
    };
    mail_1.default
        .send(msg)
        .then(() => {
        console.log('Email sent');
    })
        .catch((error) => {
        console.error(error);
    });
}
function sendConfirmationEmailAdmin(to, subject, body) {
    const msg = {
        to,
        from: process.env.ADMIN_EMAIL, // Your verified SendGrid sender
        subject,
        html: body,
    };
    mail_1.default
        .send(msg)
        .then(() => {
        console.log('Email sent');
    })
        .catch((error) => {
        console.error(error);
    });
}
