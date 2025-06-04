import express from "express";
import dotenv from "dotenv";
import ticket_router from "./routes/ticket";
import webhook_route from "./routes/webhook";

dotenv.config();


const createApp = () => {
    const app = express();
    app.use('/', webhook_route);
    app.use(express.json());
    app.use('/', ticket_router);

    return app;
}

export default createApp;