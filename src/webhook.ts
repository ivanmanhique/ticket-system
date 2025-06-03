import express from 'express';
import Stripe from 'stripe';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { sendConfirmationEmail } from './email';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const amount = (session.amount_total || 0) / 100;
      const currency = session.currency?.toUpperCase();

      if (email) {
        const html = `
          <p>Hi,</p>
          <p>Thank you for your purchase of <strong>${amount} ${currency}</strong>.</p>
          <p>We'll send your ticket shortly.</p>
        `;

        await sendConfirmationEmail(email, 'Ticket Purchase Confirmation', html);
        await sendConfirmationEmail(
          process.env.ADMIN_EMAIL!,
          'New Ticket Purchase',
          `<p>${email} purchased ${amount} ${currency}</p>`
        );
      }
    }

    res.status(200).json({ received: true });
    return;
  }

app.post('/webhook',bodyParser.raw({ type: 'application/json' }),stripeWebhookHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
