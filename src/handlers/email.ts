import { Ticket } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import { strict } from 'assert';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export function sendConfirmationEmail(to: string, _name: string, amount: number,
     currency: string, qrDataUrl: string, ticket : Ticket) {
    const msg = {
        to,
        from: process.env.ADMIN_EMAIL!, 
        templateId: 'd-5147e095f0304d98bf4c326aa487d32c',
        dynamic_template_data: {
            name: _name,
            amount: amount,
            currency: currency,
            qrCodeImage: qrDataUrl, 
            ticketId: ticket.id
        }
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        });
}

export function sendConfirmationEmailAdmin(to: string, subject: string, body: string) {
    const msg = {
        to,
        from: process.env.ADMIN_EMAIL!, 
        subject,
        html: body,
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        });
}