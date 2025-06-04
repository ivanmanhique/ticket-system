import Stripe from 'stripe';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sendConfirmationEmail, sendConfirmationEmailAdmin } from './email';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

async function uploadQrToCloudinary(data: string): Promise<string> {
  try {
    // Generate QR code as a buffer
    const qrBuffer = await QRCode.toBuffer(data, {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000', // QR code color
        light: '#ffffff' // Background color
      }
    });

    // Convert buffer to stream
    const stream = Readable.from(qrBuffer);

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tickets',
          resource_type: 'image',
          public_id: `ticket_${Date.now()}`,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      );
      
      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('QR generation error:', error);
    throw error;
  }
}

const stripeWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(`Webhook Error: ${(err as Error).message}`);
    res.status(400).send(`Webhook Error`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const name = session.customer_details?.name ?? "Meraki";
      const amount = (session.amount_total || 0) / 100;
      const currency = session.currency?.toUpperCase() ?? "PLN";
      
      // Generate a ticket
      const ticket = await prisma.ticket.create({
        data: {
          sessionId: session.id,
          email: email!,
        },
      });

      console.log('🎟️ Ticket created:', ticket.id);

      // Generate QR code and upload to Cloudinary
      const qrDataUrl = await uploadQrToCloudinary(ticket.id);
      console.log('Ticket QR URL: ', qrDataUrl);

      if (email) {
        // Send emails
        await Promise.all([
          sendConfirmationEmail(email, name, amount, currency, qrDataUrl, ticket),
          sendConfirmationEmailAdmin(
            process.env.ADMIN_EMAIL!,
            'New Ticket Purchase',
            `<p>${email} purchased ${amount} ${currency}</p>
            <p>Here is the ticket QR code:</p>
            <img src="${qrDataUrl}" alt="Your Ticket QR" />
            <p>Ticket ID: ${ticket.id}</p>
            `
          )
        ]);
      }

      res.status(200).json({ received: true });
      return;
    } catch (error) {
      console.error('Error processing checkout session:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  res.status(200).json({ received: true });
  return;
};

export default stripeWebhookHandler;