import { Router } from "express";
import bodyParser from 'body-parser';
import stripeWebhookHandler from '../handlers/webhook';
const webhook_route = Router();

webhook_route.post('/webhook',bodyParser.raw({ type: 'application/json' }), stripeWebhookHandler);

export default webhook_route;