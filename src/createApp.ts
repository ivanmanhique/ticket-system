import express from "express";
import dotenv from "dotenv";
import ticket_router from "./routes/ticket";
import webhook_route from "./routes/webhook";
import cors from 'cors';

dotenv.config();


const createApp = () => {
    const app = express();

    app.use(cors({
        origin: ['https://ticket-sys.youthmeraki.com'], // whitelist your domain
        methods: ['GET', 'POST'],
    }));

    app.use('/', webhook_route);
    app.use(express.json());
    app.use('/', ticket_router);

    return app;
}

export default createApp;