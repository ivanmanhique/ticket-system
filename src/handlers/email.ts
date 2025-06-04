import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export function sendConfirmationEmail(to: string, subject: string, body: string) {
    const msg = {
        to,
        from: process.env.ADMIN_EMAIL!, // Your verified SendGrid sender
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
